/**
 * gm
 */
export interface UserInfo {
    openId: string;
    playerId: number;
}

/**
 *  gm 参数信息
 */
export interface GmParam {
    type: 'string'|'int'|'long';
    name: string;
    regex: string;
    example: string;
}

/**
 * gm 命令信息
 */
export interface GmCommandInfo {
    type: number;

    name: string;

    params: Array<GmParam>
}
