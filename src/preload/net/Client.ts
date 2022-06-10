import {ByteInputBuffer, ByteOutputBuffer} from "./ByteBuffer";
import {ProtoManager} from "./Proto";
import {Socket} from "net";
import crc from 'crc-32'
import {Protocol} from "../../renderer/src/common/Protocol";
import { ConsoleUtil } from "../../renderer/src/common/ConsoleUtil";
import { ProtocolHeader } from "./ProtocolHeader";

export type EventType = 'close'|'connect'|'data'|'error'|'timeout'|'end';

export interface Client {
    onEvent: (event: EventType, func: (...args: any[]) => void) => Client;
    connect: (connectListener?:() => void) => Promise<Client>
    sendData: (protocolId: number, data: any) => void;
    activity: () => boolean;
    destroy: () => void;
    buildMessage: (protocolId: number, data: any) => any;
    receiveData: (data:Uint8Array, isNodeClient:boolean) => void;
    host: string;
    port: number;
}

export class TcpClient implements Client {
    readonly openId: string;

    readonly host: string;
    readonly port: number;

    protected timer: any;
    private readonly nodeClient: boolean;

    protected client: Socket|undefined;

    readonly onData: (openId: string, protocolId: number, obj: any) => void;

    constructor(openId: string, host: string, port: number, onData: (openId: string, protocolId: number, obj: any) => void, nodeClient = false) {
        this.nodeClient = nodeClient;
        this.openId = openId;
        this.onData = onData;
        this.host = host;
        this.port = port;
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
            this.timer = setInterval(() => {this.sendMessage(Protocol.CLIENT_PING, new Uint8Array([]))}, 20000);
        }).on("data", data => {
            this.receiveData(data, this.nodeClient);
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

        if(! this.client.writable) {
            return "Client已经失效";
        }
        let write = this.client.write(messageData);
        if (! write) {
            return "请求失败";
        }
        return "";
    }
    /**
     * 会根据 protocol和data组装 message
     * @param protocolId
     * @param data
     */
    sendData = (protocolId: number, data: any) => {
        ConsoleUtil.log("===Request protocol[" + protocolId + "], data:"+ data)
        try {
            const bytes = this.buildMessage(protocolId, data);
            const sendMessage = this.sendMessage(protocolId, bytes);
            if (sendMessage !== "") {
                this.onData(this.openId, Protocol.ERROR_STATUS_TIPS_RSP, {status: -1, desc:"协议:["+protocolId+"]发送失败, "+sendMessage})
            }
        } catch (e) {
            this.onData(this.openId, Protocol.ERROR_STATUS_TIPS_RSP, {status: -1, desc:"协议:["+protocolId+"]编码错误"})
            console.error(e);
        }
    }
    /**
     * 找到response的 type
     * @param protocolId
     */
    protected findRspType = (protocolId: number) => {
        return ProtoManager.findRspProto(protocolId)
    }

    public buildMessage = (protocolId: number, data: any):Uint8Array => {
        const type = ProtoManager.findReqProto(protocolId)
        const message = type.create(data)
        let uint8Array = type.encode(message).finish();
        const header = ProtocolHeader.create(protocolId, crc.buf(uint8Array));
        return header.toByteArray(uint8Array);
    }

    /**
     * 接收服务器数据
     * @param data 
     * @param isNodeClient 
     * @returns 
     */
    receiveData = (data:Uint8Array, isNodeClient:boolean) : void => {
        if (data.length < 8) {
            // 不够header的长度
            return;
        }

        const dis = new ByteInputBuffer(data);
        while(! dis.isEmpty()) {
            const header = isNodeClient ?
                ProtocolHeader.createNodeHeaderByBytes(dis)
                : ProtocolHeader.createServerHeaderByBytes(dis);
            if (dis.lastLength() < header.length) {
                return;
            }
            const uint8Array = dis.readBytes(header.length);
            if (header.protocolId === Protocol.CLIENT_PONG) {
                continue
            }

            const type = this.findRspType(header.protocolId)
            try {
                const message = type.decode(uint8Array);
                this.onData(this.openId, header.protocolId, message.toJSON())
            }catch(e) {
                this.onData(this.openId, Protocol.ERROR_STATUS_TIPS_RSP, {status: -1, desc:"解析proto错误"})
                console.error(e);
            }
        }
    }
}
