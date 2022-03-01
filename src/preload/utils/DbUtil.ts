export class DbUtil {
    /**
     * 获得服务器对应的组ID
     * @param serverId
     * @return
     */
    static getGroupId(serverId: number): number {
        return Math.floor(serverId / 1000);
    }
    /** 获得serverInfo key
     */
    static getServerNodeInfoKey(groupId: number|string): string {
        return "SERVER_NODE_REDIS_MAP_KEY#LOGIC#" + groupId;
    }
}
