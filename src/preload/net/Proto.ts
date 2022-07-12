import pb, {Root, Type} from 'protobufjs';
import {ProtoInfo} from "../utils/ProtoInfo";
import {SettingManager} from "../utils/SettingManager";
import {ipcRenderer} from 'electron'
import fs from "fs";
import * as http from "http";

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

    public findRspEnum(): pb.Enum {
        return this.root.lookupEnum(Proto.RESPONSE_ENUM_NAME)
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
    private static currentPath: string;
    private static requestProtoInfos: Array<ProtoInfo> = [];
    private static responseProtoInfoMap: Record<number, ProtoInfo> = {};

    public static findReqProto(protocolId: number):Type {
        return ProtoManager._proto.findReqProto(protocolId);
    }

    public static findType(name: string):pb.Type|pb.Enum {
        return this._proto.findType(name);
    }

    public static getRequestProtoInfos(): Array<ProtoInfo> {
        return this.requestProtoInfos;
    }

    public static getResponseProtoInfo(protocolId: number): ProtoInfo {
        return this.responseProtoInfoMap[protocolId];
    }


    public static findRspProto(protocolId: number):Type {
        return ProtoManager._proto.findRspProto(protocolId);
    }

    static loadProto():boolean {
        if (SettingManager.setting.protoFilePath.current === ''
        || this.currentPath === SettingManager.setting.protoFilePath.current) {
            return false;
        }

        this.currentPath = SettingManager.setting.protoFilePath.current;
        if (this.currentPath.startsWith("http")) {
            const data = ipcRenderer.sendSync('get_request', this.currentPath);
            ProtoManager.init0(data)
        }else {
            const data = fs.readFileSync(this.currentPath, "utf-8")
            ProtoManager.init0(data)
        }
        return true;
    }

    private static init0(data: string) {
        this.requestProtoInfos = [];
        this.responseProtoInfoMap = {}
        this._proto = new Proto(data);
        this.initProtoInfo().then(() => {
            console.log("解析Request和Response完成!")
        });
    }

    private static async initProtoInfo() {
        let reqEnum = this._proto.findReqEnum();
        for (let reqEnumKey in reqEnum.values) {
            if (reqEnumKey === 'ProtoReqId_NONE' || !reqEnumKey.startsWith(Proto.REQUEST_ENUM_NAME)) {
                continue
            }
            const protocolId = reqEnum.values[reqEnumKey];
            if (protocolId < 1008) {
                // 系统以及登录相关协议
                continue
            }

            let type = this.findReqProto(protocolId);
            this.requestProtoInfos.push(new ProtoInfo(protocolId, type.name, type.comment));
        }

        let rspEnum = this._proto.findRspEnum()
        for (let rspEnumKey in rspEnum.values) {
            if (rspEnumKey === 'ProtoRspId_NONE' || !rspEnumKey.startsWith(Proto.RESPONSE_ENUM_NAME)) {
                continue
            }
            const protocolId = rspEnum.values[rspEnumKey];
            let type = this.findRspProto(protocolId);
            this.responseProtoInfoMap[protocolId] = new ProtoInfo(protocolId, type.name, type.comment);
        }
    }
}

if (ProtoManager.loadProto()) {
    console.log("协议加载成功!")
}
