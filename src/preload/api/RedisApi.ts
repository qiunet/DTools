import {redisClient, refreshClient} from "../utils/redis/RedisClient";
import {ServerInfo} from "../net/node/ServerInfo";
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
       const nodeData = await client.HGETALL("SERVER_INFO_DATA#LOGIC");
        for(let info in nodeData) {
            arr.push(new ServerInfo(JsonUtil.stringToJson(nodeData[info])))
        }
        return arr;
    }
}
export const RedisApi = new RedisAPI();
