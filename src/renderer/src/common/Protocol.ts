/**
 * 必须知道的协议ID
 */
export class Protocol {
    static readonly ERROR_STATUS_TIPS_RSP = 4;

    static readonly GM_COMMAND_INDEX_REQ = 606;
    static readonly GM_COMMAND_LIST_RSP = 607;

    static readonly GM_COMMAND_REQ = 608;
    static readonly GM_COMMAND_RSP = 609;

    static readonly GM_DEBUG_PROTOCOL_REQ = 610;
    static readonly GM_DEBUG_PROTOCOL_RSP = 611;

    static readonly CLIENT_PING = 700;
    static readonly CLIENT_PONG = 701;

    static readonly LOGIN_REQ = 1001;
    static readonly LOGIN_RSP = 1001001;

    static readonly LOGOUT_REQ = 1002;

    // 请求随机名字
    static readonly RANDOM_NAME_REQ = 1007;
    static readonly RANDOM_NAME_RSP = 1007001;

    static readonly REGISTER_REQ = 1003;
    static readonly REGISTER_RSP = 1003001;
    /**
     * 玩家数据变动
     */
    static readonly PLAYER_DATA_PUSH = 1000001;
    /**
     * 货币变动
     */
    static readonly CURRENCY_UPDATE_PUSH = 1000000;
    /**
     * 忽略协议ID
     */
    static readonly IGNORE_PROTOCOL_ID = []
}
