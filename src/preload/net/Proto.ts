import pb, {Root, Type} from 'protobufjs';
import {StringUtil} from "../../renderer/src/common/StringUtil";
import {RequestProtoInfo} from "../utils/RequestProtoInfo";
import {SettingManager} from "../utils/SettingManager";
import fs from "fs";

/**
 * proto 数据管理
 */
class Proto {
    public static readonly REQUEST_ENUM_NAME = "ProtoReqId";
    public static readonly RESPONSE_ENUM_NAME = "ProtoRspId";
    private readonly mapping: Record<number, Type> = {};
    readonly root: Root;

    constructor(data: string) {
        this.root = pb.parse(data, {alternateCommentMode: true}).root;
    }

    public findType(name: string):pb.Type|pb.Enum {
        return this.root.lookupTypeOrEnum(name)
    }

    public findReqEnum():pb.Enum {
        return this.root.lookupEnum(Proto.REQUEST_ENUM_NAME)
    }

    public findReqProto(protocolId: number):Type {
        if (this.mapping[protocolId] !== undefined) {
            return this.mapping[protocolId];
        }
        try {
            const reqEnum = this.root.lookupEnum(Proto.REQUEST_ENUM_NAME);
            const reqClassEnumName = reqEnum.valuesById[protocolId];
            const reqClassName = reqClassEnumName.substring(Proto.REQUEST_ENUM_NAME.length + 1);
            this.mapping[protocolId] = this.root.lookupType(reqClassName)
        }catch (e) {
            console.error("protocolId: " + protocolId, e)
        }
        return this.mapping[protocolId];
    }

    /**
     * 找到
     * @param protocolId
     */
    public findRspProto(protocolId: number):Type {
        if (this.mapping[protocolId] !== undefined) {
            return this.mapping[protocolId];
        }
        try {
            const rspEnum = this.root.lookupEnum(Proto.RESPONSE_ENUM_NAME);
            const rspClassEnumName = rspEnum.valuesById[protocolId];
            const rspClassName = rspClassEnumName.substring(Proto.RESPONSE_ENUM_NAME.length + 1);
            this.mapping[protocolId] = this.root.lookupType(rspClassName);
        }catch (e) {
            console.error("protocolId: " + protocolId, e)
        }
        return this.mapping[protocolId];
    }
}

export class ProtoManager {
    private static _proto: Proto;
    private static requestProtoInfos: Array<RequestProtoInfo> = [];

    public static findReqProto(protocolId: number):Type {
        return ProtoManager._proto.findReqProto(protocolId);
    }

    public static findType(name: string):pb.Type|pb.Enum {
        return this._proto.findType(name);
    }

    public static getRequestProtoInfo(): Array<RequestProtoInfo> {
        return this.requestProtoInfos;
    }

    public static findRspProto(protocolId: number):Type {
        return ProtoManager._proto.findRspProto(protocolId);
    }

    static init(data: string) {
        if (StringUtil.isEmpty(data)) {
            throw new Error("data is empty");
        }

        if (this.isInit()) {
            return;
        }

        this._proto = new Proto(data);
        let reqEnum = this._proto.findReqEnum();
        for (let reqEnumKey in reqEnum.values) {
            if (reqEnumKey === 'ProtoReqId_NONE' || !reqEnumKey.startsWith(Proto.REQUEST_ENUM_NAME)) {
                continue
            }
            const protocolId = reqEnum.values[reqEnumKey];
            let type = this.findReqProto(protocolId);
            this.requestProtoInfos.push(new RequestProtoInfo(protocolId, type.name, type.comment));
        }
    }

    public static isInit() {
        return this._proto !== undefined;
    }
}

if (! ProtoManager.isInit()) {
    if (SettingManager.setting.protoFilePath.current === '') {
        throw Error("Not specified proto file path");
    }
    fs.readFile(SettingManager.setting.protoFilePath.current, "utf-8", (err, data) => {
        ProtoManager.init(data)
    });
}
