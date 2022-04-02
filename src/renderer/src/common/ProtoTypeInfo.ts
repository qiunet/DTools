import {Enum, Field, Type} from "protobufjs";
import {ProtoManager} from "../../../preload/net/Proto";

export class ProtoTypeInfo {

    public static build(type: Type): object {
        return this.buildType(type);
    }


    private static buildType(type: Type): Record<string, any> {
        const obj:Record<string, any> = {};
        for (let key in type.fields) {
            let field = type.fields[key];
            if (field.repeated) {
                obj[key] = [this.buildObject(field)];
            }else {
                obj[key] = this.buildObject(field);
            }
        }
        return obj;
    }

    private static buildObject(field: Field): any {
        switch (field.type) {
            case 'bool':
                return false;
            case 'int32':
            case 'int64':
            case 'uint32':
            case 'uint64':
            case 'sfixed64':
            case 'sfixed32':
            case 'fixed64':
            case 'fixed32':
            case 'float':
            case 'double':
                return 0;
            case 'string':
                return '';
            default:
                let protoType = ProtoManager.findType(field.type);
                if (protoType instanceof Enum) {
                    return 0;
                }
                return this.buildType(protoType);
        }
    }
}
