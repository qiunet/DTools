import pb, {Root, Type} from 'protobufjs';

/**
 * proto 数据管理
 */
class Proto {
    private static readonly REQUEST_ENUM_NAME = "ProtoReqId";
    private static readonly RESPONSE_ENUM_NAME = "ProtoRspId";
    private readonly mapping: Record<number, Type> = {};
    readonly root: Root;

    constructor(data: string) {
        this.root = pb.parse(data, {alternateCommentMode: true}).root;
    }

    public findReqProto(protocolId: number):Type {
        if (this.mapping[protocolId] !== undefined) {
            return this.mapping[protocolId];
        }
        const reqEnum = this.root.lookupEnum(Proto.REQUEST_ENUM_NAME);
        const reqClassEnumName = reqEnum.valuesById[protocolId];
        const reqClassName = reqClassEnumName.substring(Proto.REQUEST_ENUM_NAME.length + 1);
        return (this.mapping[protocolId] = this.root.lookupType(reqClassName));
    }

    /**
     * 找到
     * @param protocolId
     */
    public findRspProto(protocolId: number):Type {
        if (this.mapping[protocolId] !== undefined) {
            return this.mapping[protocolId];
        }
        const rspEnum = this.root.lookupEnum(Proto.RESPONSE_ENUM_NAME);
        const rspClassEnumName = rspEnum.valuesById[protocolId];
        const rspClassName = rspClassEnumName.substring(Proto.RESPONSE_ENUM_NAME.length + 1);
        return (this.mapping[protocolId] = this.root.lookupType(rspClassName));
    }
}

export class ProtoManager {
    private static _proto: Proto;

    public static findReqProto(protocolId: number):Type {
        return ProtoManager._proto.findReqProto(protocolId);
    }

    public static findRspProto(protocolId: number):Type {
        return ProtoManager._proto.findRspProto(protocolId);
    }

    public static init(data: string) {
        this._proto = new Proto(data);
    }
}
