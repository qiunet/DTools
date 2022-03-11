import {StringUtil} from "./StringUtil";
import {ElMessage} from "element-plus";
import {Client} from "../../../preload/net/Client";
import {Protocol} from "./Protocol";
import {ref} from "vue";
import Events from 'onfire.js';

/**
 * 事件类型
 */
export type EventName = 'gm-command-list' | 'gm-command-success' | 'proto-debug-response'

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
    /**
     * 所有响应
     */
    responses: Array<any> = [];

    constructor(openId: string, loginData: any) {
        this.loginData = loginData;
        this.openId = openId;
    }


    on(eventName: EventName, cb: Function, once?: boolean): void {
      this.events.on(eventName, cb, once);
    }

    once(eventName: EventName, cb: Function): void {
        this.on(eventName, cb, true);
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
        setTimeout(() => {
            this.connect()
        }, 100)
    }

    onData = (openId: string, protocolId: number, obj: any) => {
        // 移动的协议. 不记录. 不打印.
        if (protocolId === 3000000 || protocolId === 3000002 || protocolId === 3000003) return;

        console.log("==response== openId: " + openId + " protocolId: " + protocolId + " Message: " , obj);
        switch (protocolId) {
            case Protocol.CLIENT_PONG:
                break
            case Protocol.LOGIN_RSP:
                if (obj.needRegister) {
                    this.client?.sendData(Protocol.REGISTER_REQ, {name: "用户:"+openId, icon: 1})
                }
                break
            case Protocol.ERROR_STATUS_TIPS_RSP:
                ElMessage.error("错误码:"+obj.status+" 描述:"+obj.desc)
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

                if (! this._reconnect) {
                    PlayerManager.playerList.value.push(this);
                }else {
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
                // 暂时客户端没有需要显示. 以后有需要显示. 就从这里取.
                // this.responses.push(obj)
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
        const data = {openId: openId}
        const params = {
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
            method: 'POST'
        };
        fetch(loginUrl, params)
        .then(response => response.json())
        .then(data => {
           if (data.status.status !== 1) {
               ElMessage.error("登录错误:"+data.status.desc)
               return;
           }

           new PlayerData(openId, data).connect();
        })
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


