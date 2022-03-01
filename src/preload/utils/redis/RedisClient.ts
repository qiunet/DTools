import {createClient, RedisClientType} from 'redis';
import {SettingManager} from "../SettingManager";

class RedisClient {
    _client: RedisClientType;
    _redisUrl:string = '';
    constructor() {
        this._client = this.createRedisClient()
    }

    async client(): Promise<RedisClientType>{
        if (! this._client.isOpen) {
            return this._client.connect().then(v => {
                return this._client;
            });
        }
        return this._client;
    }

    private createRedisClient(): RedisClientType {
        this._redisUrl = SettingManager.setting.redisSelect.current;
        const url = 'redis://' + this._redisUrl;
        const _client: RedisClientType = createClient({url: url});
        _client.on('error', (err) => console.log('Redis Client Error', err));
        return _client;
    }

    async refreshClient() {
        if (SettingManager.setting.redisSelect.current === this._redisUrl) {
            return;
        }
        await this._client.disconnect()
        this._client = this.createRedisClient()
    }
}

const redis = new RedisClient();
export const redisClient = () => redis.client();
export const refreshClient = () => redis.refreshClient();
