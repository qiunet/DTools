import {StringUtil} from "./StringUtil";
import {ElMessage} from "element-plus";
import {Client} from "../../../preload/net/Client";
import {Protocol} from "./Protocol";
import {ref} from "vue";
import Events from 'onfire.js';

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
        this.client?.destroy()
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
        const ignoreProtocolId = [3000000, 3000001, 3000002, 3000003]
        if (ignoreProtocolId.find(id => id === protocolId)) return;

        console.log("==response== openId: " + openId + " protocolId: " + protocolId + " Message: " , obj);

        switch (protocolId) {
            case Protocol.CLIENT_PONG:
                break
            case Protocol.LOGIN_RSP:
                if (obj.needRegister) {
                    this.client?.sendData(Protocol.RANDOM_NAME_REQ, {gender: 1});
                }
                break
            case Protocol.RANDOM_NAME_RSP:
                this.client?.sendData(Protocol.REGISTER_REQ, {name: obj.name, icon: "1"})
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
                break
            case Protocol.CURRENCY_UPDATE_PUSH:
                if (obj.cfgId === 1) {
                    this.m1 = obj.currVal;
                }else if (obj.cfgId === 2) {
                    this.m2 = obj.currVal;
                }
                break
            default:
                this.events.fire('server-response', protocolId, obj)
        }
    }
    connect() {
        window.client_api.connect(this.loginData.serverHost, this.loginData.serverPort, this.openId, this.loginData.ticket, this.onData)
        .then(client => {
            this.client = client
            client.sendData(Protocol.LOGIN_REQ, {ticket: this.loginData.ticket});
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
    sendData(protocolId: number, data: any) {
        this.client?.sendData(protocolId, data);
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
    static login(openId: string) {
        const loginUrl = window.tool_api.setting().loginUrl.current;
        if (StringUtil.isEmpty(loginUrl)) {
            throw new Error("LoginUrl must setting!")
        }
       const result = window.ipcRenderer.sendSync('post_request', loginUrl, {uid: openId, token: ''});
       if (result.status.code !== 1) {
           ElMessage.error("登录错误:"+result.status.desc)
           return;
       }

       new PlayerData(openId, result).connect();
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


