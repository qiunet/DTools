import {redisClient, refreshClient} from "../utils/redis/RedisClient";
import {ServerInfo} from "../net/node/ServerInfo";
import {DbUtil} from "../utils/DbUtil";
import {JsonUtil} from "../../renderer/src/common/JsonUtil";

export class RedisAPI {
    /**
     * 刷新redis地址
     * 关闭原有地址
     */
    changeRedis = async () => {
       return refreshClient();
    }
    /**
     * 获得当前Logic服务器的地址
     */
    serverList = async ():Promise<Array<ServerInfo>> => {
        const client = await redisClient();

        const arr: Array<ServerInfo> = [];
        const key = await client.GET('CURRENT_ONLINE_PLAYER_REDIS_KEY')
        if (key === null) {
            return arr;
        }
        const data = await client.HGETALL(key)
        if (data === null) {
            return arr;
        }

        for(let groupId in data) {
           const nodeData = await client.HGETALL(DbUtil.getServerNodeInfoKey(groupId));
            for(let info in nodeData) {
                arr.push(new ServerInfo(JsonUtil.stringToJson(nodeData[info])))
            }
        }
        return arr;
    }
}
export const RedisApi = new RedisAPI();
