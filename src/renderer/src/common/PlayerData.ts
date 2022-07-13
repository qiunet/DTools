import {StringUtil} from "./StringUtil";
import {ElMessage} from "element-plus";
import {Client} from "../../../preload/net/Client";
import {Protocol} from "./Protocol";
import {ref} from "vue";
import Events from 'onfire.js';
import {ResponseInfo} from "./ResponseInfo";

/**
 * 事件类型
 */
export type EventName = 'gm-command-list' | 'gm-command-success' | 'proto-debug-response' | 'server-response'

export class PlayerData {
    private readonly events: Events = new Events();
    private eventListener: Array<EventName> = [];
    /**
     * 登录数据. 可以重登使用
     * @private
     */
    private readonly loginData: any;
    /**
     * 响应的数据信息
     */
    responseList: Array<ResponseInfo> = [];

    tcpClient: Client|undefined;
    kcpClient: Client|undefined;
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
        return this.tcpClient?.host+":"+this.tcpClient?.port;
    }

    logout() {
        this.tcpClient?.sendData(Protocol.LOGOUT_REQ, {});
        this.events.off('server-response');
    }

    private _reconnect: boolean = false;
    /**
     * 模拟重连
     */
    reconnect() {
        this._reconnect = true;
        this.tcpClient?.destroy()
        PlayerManager.logout(this.openId, false)
        this.events.off('server-response');
        setTimeout(() => {
            this.connect()
        }, 1000)
    }

    cleanupResponses = () => {
        this.responseList.splice(0);
    }

    onData = (openId: string, protocolId: number, obj: any) => {
        // 移动的协议. 不记录. 不打印.
        const ignoreProtocolId = Protocol.IGNORE_PROTOCOL_ID;
        if (ignoreProtocolId.find(id => id === protocolId)) return;

        console.log("==response== openId: " + openId + " protocolId: " + protocolId + " Message: " , obj);
        if(this.onReceive(openId, protocolId, obj)){
            return;
        }

        switch (protocolId) {
            case Protocol.CLIENT_PONG:
                break
            case Protocol.LOGIN_RSP:
                if (obj.needRegister) {
                    this.tcpClient?.sendData(Protocol.RANDOM_NAME_REQ, {gender: 1});
                }
                break
            case Protocol.RANDOM_NAME_RSP:
                this.tcpClient?.sendData(Protocol.REGISTER_REQ, {name: obj.name});
                break
            case Protocol.KCP_TOKEN_RSP:
                let host: string = this.tcpClient?.host === undefined ? "" : this.tcpClient.host;
                let port: number = this.tcpClient?.port === undefined ? 0 : this.tcpClient.port;
                window.client_api.kcpConnect(obj.convId, host, port, openId, this.onData).then(c => {
                    c.sendData(Protocol.KCP_BIND_AUTH_REQ, {playerId: this.playerId, token: obj.token})
                    this.kcpClient = c;
                })
                break;
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
                break
            case Protocol.CURRENCY_UPDATE_PUSH:
                if (obj.cfgId === 1) {
                    this.m1 = obj.currVal;
                }else if (obj.cfgId === 2) {
                    this.m2 = obj.currVal;
                }
                break
            default:
                let responseInfo = new ResponseInfo(protocolId, obj);
                this.events.fire('server-response', responseInfo)
                this.responseList.push(responseInfo)
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
        return false;
    }

    /**
     * 是否有kcp
     */
    kcpPrepare(): boolean {
        return this.kcpClient !== undefined;
    }


    connect() {
        window.client_api.connect(this.loginData.serverHost, this.loginData.serverPort, this.openId, this.loginData.ticket, this.onData)
        .then(client => {
            this.tcpClient = client;
            this.tcpClient?.sendData(Protocol.LOGIN_REQ, {ticket: this.loginData.ticket});
            setTimeout(() => {
                this.tcpClient?.sendData(Protocol.KCP_TOKEN_REQ, {})
            }, 500);
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
     * @param kcp
     */
    sendData(protocolId: number, data: any, kcp: boolean) {
        if (kcp) {
            this.kcpClient?.sendData(protocolId, data)
        }else {
            this.tcpClient?.sendData(protocolId, data);
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
}


