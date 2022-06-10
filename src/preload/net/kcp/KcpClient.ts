import kcp from "node-kcp-x"
import dgram, { Socket } from 'dgram';
import { EventType } from "../Client";
import {Protocol} from "../../../renderer/src/common/Protocol";
import { ConsoleUtil } from "../../../renderer/src/common/ConsoleUtil";


export class KcpClient{
    readonly openId: string;

    readonly host: string;
    readonly port: number;

    protected timer: any;

    protected client: Socket|undefined;

    readonly onData: (openId: string, protocolId: number, obj: any) => void;
    readonly convId:number;
    private kcpClient:Socket|undefined;
    private kcpObj:kcp.KCP | undefined;

    constructor(openId: string, host: string, port: number, convId:number, onData: (openId: string, protocolId: number, obj: any) => void) {
        this.openId = openId;
        this.onData = onData;
        this.host = host;
        this.port = port;
        this.convId = convId;
    }

    activity = ():boolean => {
        return !!this.kcpObj
    }

    connect = async (connectListener?:() => void): Promise<KcpClient> => {
        this.kcpObj  = new kcp.KCP(this.convId, {address: this.host, port: this.port});
        this.kcpObj.nodelay(1, 200, 2, 1);

        // kcpObj.nodelay(0, 200, 0, 0);

        this.kcpClient = dgram.createSocket('udp4');
        this.kcpObj.output((data: any, size: any, context: { port: any; address: any; }) => {
            this.kcpClient?.send(data, 0, size, context.port, context.address);
        });
                
        this.kcpClient.on('error', this.onError);
        this.kcpClient.on('message', this.onMessage);
        
        this.timer = setInterval(() => {this.kcpObj?.update(Date.now())}, 200);
        ConsoleUtil.log(`Kcp connect`)
        return this;
    }

    onError = (err: { stack: any; }) => {
        console.error(`client error:\n${err.stack}`);
    }

    onMessage = (msg: any, rinfo: any) => {
        this.kcpObj?.input(msg);
        var recv = this.kcpObj?.recv();
        try{
            if(!recv){
                ConsoleUtil.log("kcp message data is "+recv)
                return;
            }

            this.onData(this.openId, -1, recv);
        }catch(e){
            this.onData(this.openId, Protocol.ERROR_STATUS_TIPS_RSP, {status: -1, desc:"解析proto错误"})
            console.error(e);
        }
    }

    /**
     * @param protocolId
     * @param data
     */
     sendData = (protocolId: number, data: Uint8Array) => {
        ConsoleUtil.log("===Request protocol[" + protocolId + "], data:"+ data)
        try {
            const sendMessage = this.sendMessage(protocolId, data);
            if (sendMessage !== "") {
                this.onData(this.openId, Protocol.ERROR_STATUS_TIPS_RSP, {status: -1, desc:"协议:["+protocolId+"]发送失败, "+sendMessage})
            }
        } catch (e) {
            this.onData(this.openId, Protocol.ERROR_STATUS_TIPS_RSP, {status: -1, desc:"协议:["+protocolId+"]编码错误"})
            console.error(e);
        }
    }

    /**
     * 发送消息
     * @param protocolId
     * @param data 已经组装成 protobuf message data 的数据
     */
    sendMessage = (protocolId: number, data: Uint8Array): string => {
        if(! this.kcpObj) {
            return "Kcp Client已经失效";
        }
        this.kcpObj.send(Buffer.from(data));
        return "";
    }

    destroy = ():void => {
        if (! this.activity()) {
            return;
        }
        clearTimeout(this.timer)
        this.kcpObj?.release();
        this.kcpObj = undefined;

        this.kcpClient?.off('error', this.onError);
        this.kcpClient?.off('message', this.onMessage);
        this.kcpClient = undefined;
    }
}





