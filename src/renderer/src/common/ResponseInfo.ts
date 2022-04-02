import {ProtoInfo} from "../../../preload/utils/ProtoInfo";
import {DateUtil} from "./DateUtil";

export class ResponseInfo {
    /**
     * 协议ID
     * @private
     */
    private readonly protocolId: number;
    /**
     * 对应的proto信息
     */
    private readonly info: ProtoInfo;
    /**
     * response 数据
     */
    private readonly rspString: string;
    /**
     * 时间
     * @private
     */
    private readonly dt: Date

    public constructor(protocolId: number, obj: any) {
        this.info = window.client_api.rspProtoInfo(protocolId)
        this.rspString = JSON.stringify(obj);
        this.protocolId = protocolId;
        this.dt = new Date()
    }

    public getRspString(): string {
        return this.rspString;
    }

    public getProtoInfo(): ProtoInfo {
        return this.info;
    }

    public getDtString() {
        return DateUtil.timeFormat(this.dt);
    }

    public getProtocolInfo() {
        return this.info?.className +":"+this.protocolId;
    }
}
