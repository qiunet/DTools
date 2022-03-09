import {Client} from "../net/Client";
import {RequestProtoInfo} from "../utils/RequestProtoInfo";
import {ProtoManager} from "../net/Proto";
import {ProtoTypeInfo} from "../../renderer/src/common/ProtoTypeInfo";

export class ClientAPI {

    connect = (host:string, port:number, openId: string, ticket: string, onData: (openId: string, protocolId: number, obj: any) => void): Promise<Client> => {
        return new Client(openId, host, port, onData).connect();
    }
    /**
     * 请求协议信息
     */
    requestEnum = ():Array<RequestProtoInfo> => {
        return ProtoManager.getRequestProtoInfo();
    }

    buildProtoTypeInfo = (protocolId: number): object => {
        let type = ProtoManager.findReqProto(protocolId);
        return ProtoTypeInfo.build(type);
    }
}

export const ClientApi = new ClientAPI();
