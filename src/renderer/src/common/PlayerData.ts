import {StringUtil} from "./StringUtil";
import {ElMessage} from "element-plus";
import {Client} from "../../../preload/net/Client";
import {Protocol} from "./Protocol";
import {ref} from "vue";
import Events from 'onfire.js';
import { ConsoleUtil } from "./ConsoleUtil";

/**
 * 事件类型
 */
export type EventName = 'gm-command-list' | 'gm-command-success' | 'proto-debug-response' | 'server-response'

export class PlayerData {
    private readonly events: Events = new Events();
    /**
     * 登录数据. 可以重登使用
     * @private
     */
    private readonly loginData: any;
    client: Client|undefined;
    private kcpData: any;

    /**
     * 账号
     */
    openId: string ;
    /**
     * 玩家ID
     */
    playerId: number = 0;
    /**
     * 货币1
     */
    m1: number = 0;
    /**
     * 货币2
     */
    m2: number = 0;
    /**
     * 昵称
     */
    name: string = '';

    constructor(openId: string, loginData: any) {
        this.loginData = loginData;
        this.openId = openId;
    }


    on(eventName: EventName, cb: Function, once?: boolean): void {
      this.events.on(eventName, cb, once);
    }

    off(eventName: EventName) {
        console.log("# openId:", this.openId, "eventName:", eventName, "closed!");
        this.events.off(eventName);
    }

    once(eventName: EventName, cb: Function): void {
        this.on(eventName, cb, true);
    }

    get hostInfo() {
        return this.client?.host+":"+this.client?.port;
    }

    logout() {
        this.client?.sendData(Protocol.LOGOUT_REQ, {});
    }

    disconnectKcp(){
        window.ipcRenderer.send('kcp_disconnect', this.openId)
    }
    private _reconnect: boolean = false;
    /**
     * 模拟重连
     */
    reconnect() {
        this._reconnect = true;
        this.client?.destroy()
        PlayerManager.logout(this.openId, false)
        setTimeout(() => {
            this.connect()
        }, 1000)
    }

    onData = (openId: string, protocolId: number, obj: any) => {
        // 移动的协议. 不记录. 不打印.
        const ignoreProtocolId = Protocol.IGNORE_PROTOCOL_ID;
        if (ignoreProtocolId.find(id => id === protocolId)) return;
        
        ConsoleUtil.log("==response== openId: " + openId + " protocolId: " + protocolId + " Message: " + obj);
        if(this.onReceive(openId, protocolId, obj)){
            return;
        }

        switch (protocolId) {
            case Protocol.CLIENT_PONG:
                break
            case Protocol.LOGIN_RSP:
                if (obj.needRegister) {
                    this.client?.sendData(Protocol.RANDOM_NAME_REQ, {gender: 1});
                }
                break
            case Protocol.RANDOM_NAME_RSP:
                this.client?.sendData(Protocol.REGISTER_REQ, {name: obj.name});
                break
            case Protocol.ERROR_STATUS_TIPS_RSP:
                ElMessage.error("错误码:"+obj.status+" 描述:"+obj.desc)
                this.events.fire('server-response', protocolId, obj)
                break;
            case Protocol.GM_COMMAND_LIST_RSP:
                this.events.fire('gm-command-list', obj.list);
                break;
            case Protocol.GM_COMMAND_RSP:
                this.events.fire('gm-command-success');
                break
            case Protocol.GM_DEBUG_PROTOCOL_RSP:
                this.events.fire('proto-debug-response')
                break;
            case Protocol.PLAYER_DATA_PUSH:
                this.playerId = obj.playerTo.objectTo.objectId;
                this.name = obj.playerTo.objectTo.name;
                this.m1 = obj.playerTo.m1;
                this.m2 = obj.playerTo.m2;

               PlayerManager.playerList.value.push(this);
               if (this._reconnect){
                    ElMessage.success("重连成功!")
                    this._reconnect = false;
                }
                this.sendData(Protocol.KCP_TOKEN_REQ, {})
                break
            case Protocol.CURRENCY_UPDATE_PUSH:
                if (obj.cfgId === 1) {
                    this.m1 = obj.currVal;
                }else if (obj.cfgId === 2) {
                    this.m2 = obj.currVal;
                }
                break
            case Protocol.KCP_TOKEN_RSP:
                this.kcpData = obj
                this.kcpConnect();
                break;
            case Protocol.KCP_CONNECT_RSP:
                ConsoleUtil.log(`Kcp 连接成功!`)
                this.sendKcpData(Protocol.KCP_BIND_AUTH_REQ, { playerId:this.playerId, token:this.kcpData.token })
                break;
            case Protocol.KCP_BIND_AUTH_RSP:
                ConsoleUtil.log(`Kcp 连接绑定成功!`)
                break;
            default:
                this.events.fire('server-response', protocolId, obj)
        }
    }
    /**
     * 自定义接收数据
     * @param openId 
     * @param protocolId 
     * @param obj 
     * @returns 
     */
    onReceive(openId: string, protocolId: number, obj: any):boolean{
        console.log("original onReceive")
        return false;
    }


    connect() {
        window.client_api.connect(this.loginData.serverHost, this.loginData.serverPort, this.openId, this.loginData.ticket, this.onData)
        .then(client => {
            this.client = client;
            this.client?.sendData(Protocol.LOGIN_REQ, {ticket: this.loginData.ticket});
            client.onEvent('connect', () => {

            });
            client.onEvent('close', () => {
                if (! this._reconnect) {
                    PlayerManager.logout(this.openId, false)
                }
            });
        });
    }

    /**
     * 发送数据
     * @param protocolId 协议id
     * @param data
     */
    sendData(protocolId: number, data: any, isKcp:boolean=false) {
        if(isKcp){
            this.sendKcpData(protocolId, data);
        }else{
            this.sendTcpData(protocolId, data);
        }
    }

    sendTcpData(protocolId: number, data: any){
        ConsoleUtil.log(`Tcp => send data protocolId:${protocolId}`)
        this.client?.sendData(protocolId, data);
    }

    sendKcpData(protocolId: number, data: any) {
        ConsoleUtil.log(`Kcp => send data protocolId:${protocolId}`)
        const bytes = this.client?.buildMessage(protocolId, data);
        window.ipcRenderer.send('kcp_send', this.openId, protocolId, bytes)
    }

    kcpConnect() {
        window.ipcRenderer.sendSync('kcp_connect', this.openId, this.loginData.serverHost, this.kcpData.port, this.kcpData.convId);
        this.kcpBindAuth();
    }

    kcpBindAuth(){
        this.sendKcpData(Protocol.KCP_BIND_AUTH_REQ, { playerId:this.playerId, token:this.kcpData.token })
    }

    onKcpData(openId: string, protocolId: number, data: any){
        if(data instanceof Uint8Array){
            this.client?.receiveData(data, false);
        }else{
            this.onData(openId, protocolId, data);
        }
    }
}

export class PlayerManager {
    /**
     * 玩家list
     */
    static readonly playerList = ref<Array<PlayerData>>([]);
    /**
     * 新增用户 
     * @param openId
     */
    static login(openId: string){
        const loginUrl = window.tool_api.setting().loginUrl.current;
        if (StringUtil.isEmpty(loginUrl)) {
            throw new Error("LoginUrl must setting!")
        }

        const loginScript = window.tool_api.getScript();
        if(!StringUtil.isEmpty(loginScript)){
            console.log("eval loginScript")
            try {
                eval(loginScript);
            } catch (error) {
                console.error("eval loginScript error " + error)
            }
            return;
        }
        const result = this.httpLogin(loginUrl, openId, {uid:openId, token:''});
        if(result){
            new PlayerData(openId, result).connect();
            this.onKcpEvent();
        }
    }

    static httpLogin(loginUrl:string, openId:string, data:object){
        const result = window.ipcRenderer.sendSync('post_request', loginUrl, data);
        if (result.status.code !== 1) {
            ElMessage.error("登录错误:"+result.status.desc)
            return null;
        }
        return result;
    }

    /**
     * 登出
     * @param openId
     * @param callLogout
     */
    static logout(openId: string, callLogout:boolean = true) {
        let index = this.playerList.value.findIndex(value => value.openId === openId);
        if (index !== -1) {
            if (callLogout) {
                this.playerList.value[index].logout()
            }
            this.playerList.value[index].disconnectKcp();
            this.playerList.value.splice(index, 1);
        }
    }

    /**
     * 退出所有账号
     */
    static destroy() {
        this.playerList.value.forEach(data => data.logout())
        this.playerList.value.splice(0, this.playerList.value.length)
    }

    private static isOnKcpEvent:boolean = false;
    static onKcpEvent(){
        if(this.isOnKcpEvent){
            return;
        }

        window.ipcRenderer.addListener("kcp_server_data", (event, ...args)=>{
            let index = this.playerList.value.findIndex(value => value.openId === args[0]);
            if(index != -1){
                this.playerList.value[index].onKcpData(args[0], args[1], args[2])
            }
        })
        this.isOnKcpEvent = true;
    }
}


