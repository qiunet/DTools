import {createClient, RedisClientType} from 'redis';
import {SettingManager} from "../SettingManager";

class RedisClient {
    _client: RedisClientType;
    _redisUrl:string|undefined;

    constructor() {
       this._client = this.createRedisClient();
       this.client()
    }

    async client(): Promise<RedisClientType>{
        if (! this._client.isOpen) {
            this._client.on('connect', () => {
                console.log("Redis client connected");
            })
            console.log("Redis client connecting...");
            await  this._client.connect();
        }
        return this._client;
    }

    private createRedisClient(): RedisClientType {
        this._redisUrl = SettingManager.setting.redisSelect.current;
        const url = 'redis://' + this._redisUrl;
        return createClient({url: url});
    }

    async refreshClient():Promise<boolean> {
        console.log('Refreshing client refresh!')
        if (SettingManager.setting.redisSelect.current === this._redisUrl) {
            return this._client.isOpen;
        }
        this._redisUrl = undefined;
        if (this._client.isOpen) {
            await this._client.disconnect()
        }
        this._client = this.createRedisClient()
        return this.client().then(c => c.isOpen).catch(r => this._client.isOpen);
    }
}

const redis = new RedisClient();
export const redisClient = () => redis.client();
export const refreshClient = () => redis.refreshClient();
