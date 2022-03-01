import {ByteInputBuffer, ByteOutputBuffer} from "./ByteBuffer";
import {ProtoManager} from "./Proto";
import {Socket} from "net";
import crc from 'crc-32'
import fs from "fs";
import {SettingManager} from "../utils/SettingManager";

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
}
export type EventType = 'close'|'connect'|'data'|'error'|'timeout'|'end';
export class Client {

    readonly openId: string;

    readonly host: string;
    readonly port: number;

    protected timer: any;
    private readonly nodeClient: boolean;

    protected client: Socket|undefined;

    onData: (openId: string, protocolId: number, obj: any) => void;

    constructor(openId: string, host: string, port: number, onData: (openId: string, protocolId: number, obj: any) => void, nodeClient = false) {
        if (SettingManager.setting.protoFilePath.current === '') {
            throw Error("Not specified proto file path");
        }
        fs.readFile(SettingManager.setting.protoFilePath.current, "utf-8", (err, data) => {
            ProtoManager.init(data)
        });
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
            this.timer = setInterval(() => {
                const type = ProtoManager.findRspProto(700);
                const message = type.create({});
                this.sendMessage(700, type.encode(message).finish())
            }, 20000);
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
                const type = this.findRspType(header.protocolId)
                const message = type.decode(uint8Array);
                this.onData(this.openId, header.protocolId, message.toJSON())
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
     * @param data
     */
    sendMessage = (protocolId: number, data: Uint8Array): string => {
        if (! this.activity) {
            return "已经断开连接";
        }

        if (this.client === undefined)  {
            return "没有创建连接";
        }
        const header = ProtocolHeader.create(protocolId, crc.buf(data));
        let write = this.client.write(header.toByteArray(data));
        if (! write) {
            return "请求失败";
        }
        return "";
    }
    /**
     * 找到response的 type
     * @param protocolId
     */
    protected findRspType = (protocolId: number) => {
        return ProtoManager.findRspProto(protocolId)
    }
}

/**
 * Socket 管理
 */
export class NetManager {
    private static readonly clients: Record<string, Client> = {};

    public static host: string = '';
    public static port: number = 0;

    static setNetWork = (host:string, port: number) => {
        if (this.host !== '') {
            // 释放原有连接
            for (let clientsKey in this.clients) {
                this.clients[clientsKey].destroy()
            }
        }

        this.host = host;
        this.port = port;
    }

    static connect = (openId: string, onData: (openId: string, protocolId: number, obj: any) => void):Promise<Client> => {
        if (this.host === '' || this.port === 0 ){
            throw Error("host and port not setting!");
        }

        if (this.clients[openId] !== undefined) {
            this.clients[openId].destroy()
        }

        return new Client(openId, this.host, this.port, onData)
            .connect().then(client => {
                this.clients[openId] = client;
                client.onEvent('close', () => {
                    delete this.clients[openId];
                });
                return client;
            });
    }

    /**
     * 取到Client
     * @param openId
     */
    static getClient = (openId: string):Client => {
        return this.clients[openId];
    }
}

//
// NetManager.setNetWork("localhost", 8880)
// NetManager.connect("qiunet").then(client => {
//     const type = proto.findReqProto(1007);
//     const message = type.create({gender: 1});
//     client.sendMessage(1007, type.encode(message).finish())
// })
//
//
// // redisClient().then(client => client.SET("qiunet", "qiunet")).then(console.log).then(t => refreshClient())
// //     .then(() => {
// //     redisClient().then(client => client.SET("qiunet", "qiunet")).then(console.log)
// // });
