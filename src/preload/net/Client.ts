import {ByteInputBuffer, ByteOutputBuffer} from "./ByteBuffer";
import {ProtoManager} from "./Proto";
import {Socket} from "net";
import crc from 'crc-32'
import {Protocol} from "../../renderer/src/common/Protocol";
import {DialWithOptions, UDPSession} from "./kcp/session"
import {ConnectionType} from "../utils/Enums";


export class ProtocolHeader {
    /**
     * 服务端的 magic
     */
    private static readonly MAGIC_BYTES = [102, 97, 115, 116];
    private static readonly SERVER_REQUEST_HEADER_LENGTH = 16;

    magic: Uint8Array = new Uint8Array(4);
    protocolId: number = 0;
    length: number = 0;
    crc: number = 0;

    /**
     * 服务器对客户端下发
     * @param dis
     */
    static createServerHeaderByBytes(dis: ByteInputBuffer): ProtocolHeader {
        const header = new ProtocolHeader();
        header.length = dis.readInt();
        header.protocolId = dis.readInt();
        return header;
    }

    /**
     * Node server 对客户端下发
     *
     * @param dis
     */
    static createNodeHeaderByBytes(dis: ByteInputBuffer): ProtocolHeader {
        const header = new ProtocolHeader();
        header.magic = dis.readBytes(4);
        header.length = dis.readInt();
        header.protocolId = dis.readInt();
        header.crc = dis.readInt();
        return header;
    }

    /**
     * 上行创建 header
     * @param protocolId
     * @param crc
     */
    static create(protocolId: number, crc: number = 0): ProtocolHeader {
        const header = new ProtocolHeader();
        header.magic.set(ProtocolHeader.MAGIC_BYTES)
        header.protocolId = protocolId;
        header.length = 0;
        header.crc = crc;
        return header;
    }


    toByteArray = (data: Uint8Array):Uint8Array => {
        const buffer = new ByteOutputBuffer(ProtocolHeader.SERVER_REQUEST_HEADER_LENGTH + data.length);
        buffer.writeBytes(this.magic);
        buffer.writeInt(data.length)
        buffer.writeInt(this.protocolId)
        buffer.writeInt(this.crc)
        buffer.writeBytes(data)
        return buffer.toByteArray();
    }

    toString(): string {
        return JSON.stringify(this, null)
    }
}
export type EventType = 'close'|'connect'|'data'|'error'|'timeout'|'end';

export abstract class Client {
    protected connType: ConnectionType;
    readonly onData: (connType: ConnectionType, openId: string, protocolId: number, obj: any) => void;

    abstract onEvent: (event: EventType, func: (...args: any[]) => void) => Client;
    abstract sendMessage: (protocolId: number, messageData: Uint8Array) => string;
    abstract connect: (connectListener?:() => void) => Promise<Client>
    abstract activity: () => boolean;
    abstract destroy: () => void;

    readonly openId: string;
    readonly host: string;
    readonly port: number;


    protected constructor(connType: ConnectionType, openId: string, host: string, port: number, onData: (connType: ConnectionType, openId: string, protocolId: number, obj: any) => void) {
        this.connType = connType;
        this.onData = onData;
        this.openId = openId;
        this.host = host;
        this.port = port;
    }

    /**
     * 找到response的 type
     * @param protocolId
     */
    protected findRspType = (protocolId: number) => {
        return ProtoManager.findRspProto(protocolId)
    }

    /**
     * 会根据 protocol和data组装 message
     * @param protocolId
     * @param data
     */
    sendData = (protocolId: number, data: any):void => {
        console.log("===Request protocol[" + protocolId + "], data:", data)
        const type = ProtoManager.findReqProto(protocolId)
        const message = type.create(data)
        let uint8Array: Uint8Array;
        try {
            uint8Array = type.encode(message).finish();
            const sendMessage = this.sendMessage(protocolId, uint8Array);
            if (sendMessage !== "") {
                this.onData(this.connType, this.openId, Protocol.ERROR_STATUS_TIPS_RSP, {status: -1, desc:"协议:["+protocolId+"]发送失败, "+sendMessage})
            }
        } catch (e) {
            this.onData(this.connType, this.openId, Protocol.ERROR_STATUS_TIPS_RSP, {status: -1, desc:"协议:["+protocolId+"]编码错误"})
            console.error(e);
        }
    }
}

export class TcpClient extends Client {
    protected timer: any;
    private readonly nodeClient: boolean;
    protected client: Socket|undefined;

    constructor(openId: string, host: string, port: number, onData: (connType: ConnectionType, openId: string, protocolId: number, obj: any) => void, nodeClient = false) {
        super(ConnectionType.TCP, openId, host, port, onData)
        this.nodeClient = nodeClient;
    }

    /**
     * 是否活跃
     */
    activity = (): boolean => {
        return this.client !== undefined && this.client.writable;
    }
    /**
     * 连接
     * @param onData
     * @param connectListener
     */
    connect = async (connectListener?:() => void): Promise<Client> => {
        this.client = new Socket().connect(this.port, this.host, () => {
            if (connectListener) {
                connectListener()
            }
            this.timer = setInterval(() => {this.sendMessage(Protocol.CLIENT_PING, new Uint8Array([]))}, 5000);
        }).on("data", data => {
            if (data.length < 8) {
                // 不够header的长度
                return;
            }

            const dis = new ByteInputBuffer(data);
            while(! dis.isEmpty()) {
                const header = this.nodeClient ?
                    ProtocolHeader.createNodeHeaderByBytes(dis)
                    : ProtocolHeader.createServerHeaderByBytes(dis);
                if (dis.lastLength() < header.length) {
                    return;
                }
                const uint8Array = dis.readBytes(header.length);
                if (header.protocolId === Protocol.CLIENT_PONG || header.protocolId === Protocol.CLIENT_PING) {
                    continue
                }

                const type = this.findRspType(header.protocolId)
                try {
                    const message = type.decode(uint8Array);
                    this.onData(this.connType, this.openId, header.protocolId, message.toJSON())
                }catch(e) {
                    this.onData(this.connType, this.openId, Protocol.ERROR_STATUS_TIPS_RSP, {status: -1, desc:"解析proto错误"})
                    console.error(e)
                }
            }
        }).on('error', err => {
            console.error("Connect Errors", err)
        });
        return this;
    }
    /**
     * 事件
     */

    onEvent = (event: EventType, func: (...args: any[]) => void): Client => {
        this.client?.on(event, func);
        return this;
    }

    /**
     * 销毁连接
     */
    destroy = ():void => {
        if (! this.activity()) {
            return;
        }
        clearTimeout(this.timer)
        this.client?.destroy();
    }
    /**
     * 发送消息
     * @param protocolId
     * @param messageData 已经组装成 protobuf message data 的数据
     */
    sendMessage = (protocolId: number, messageData: Uint8Array): string => {
        if (! this.activity) {
            return "已经断开连接";
        }

        if (this.client === undefined)  {
            return "没有创建连接";
        }

        const header = ProtocolHeader.create(protocolId, crc.buf(messageData));
        if(! this.client.writable) {
            return "Client已经失效";
        }
        let write = this.client.write(header.toByteArray(messageData));
        if (! write) {
            return "请求失败";
        }
        return "";
    }
}


export class KcpClient extends Client {
    private session: UDPSession| undefined;
    protected timer: any;
    readonly convId: number



    constructor(convId: number, openId: string, host: string, port: number, onData: (connType: ConnectionType, openId: string, protocolId: number, obj: any) => void) {
        super(ConnectionType.KCP, openId, host, port, onData)
        this.convId = convId;
    }

    activity = (): boolean => {
        return this.session !== undefined
    }

    connect = async (connectListener?:() => void): Promise<Client> => {
        this.session = DialWithOptions({
            conv: this.convId,
            port: this.port,
            host: this.host,
        });

        if (connectListener) {
            connectListener()
        }

        this.session.on("recv", data => {
            const dis = new ByteInputBuffer(data);
            const header = ProtocolHeader.createServerHeaderByBytes(dis);
            const uint8Array = dis.readBytes(header.length);
            if (header.protocolId === Protocol.CLIENT_PONG) {
               return;
            }

            try {
                const type = this.findRspType(header.protocolId)
                const message = type.decode(uint8Array);
                this.onData(this.connType, this.openId, header.protocolId, message.toJSON())
            }catch(e) {
                this.onData(this.connType, this.openId, Protocol.ERROR_STATUS_TIPS_RSP, {status: -1, desc:"解析proto错误"})
                console.error(e)
            }
        }).on('error', err => {
            console.error("Connect Errors", err)
        });
        this.timer = setInterval(() => {this.sendMessage(Protocol.CLIENT_PING, new Uint8Array([]))}, 5000);
        console.log("kcp connected!")
        return this;
    }

    destroy = ():void => {
        if (! this.session) {
            return
        }

        clearTimeout(this.timer)
        this.session?.close()
        this.session = undefined;
    }

    onEvent = (event: EventType, func: (...args: any[]) => void): Client => {
        this.session?.on(event, func);
        return this;
    }

    /**
     * 发送消息
     * @param protocolId
     * @param messageData 已经组装成 protobuf message data 的数据
     */
    sendMessage = (protocolId: number, messageData: Uint8Array): string => {
        if (! this.activity) {
            return "已经断开连接";
        }

        if (this.session === undefined)  {
            return "没有创建连接";
        }

        const header = ProtocolHeader.create(protocolId, crc.buf(messageData));

        let write = this.session.write(Buffer.from(header.toByteArray(messageData)));
        if (! write) {
            return "请求失败";
        }
        return "";
    }
}
