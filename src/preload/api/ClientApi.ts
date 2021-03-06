import {Client, KcpClient, TcpClient} from "../net/Client";
import {ProtoInfo} from "../utils/ProtoInfo";
import {ProtoManager} from "../net/Proto";
import {ProtoTypeInfo} from "../../renderer/src/common/ProtoTypeInfo";
import {ConnectionType} from "../utils/Enums"
export class ClientAPI {

    connect = (host:string, port:number, openId: string, ticket: string, onData: (connType: ConnectionType, openId: string, protocolId: number, obj: any) => void): Promise<Client> => {
        return new TcpClient(openId, host, port, onData).connect();
    }

    kcpConnect = (convId: number, host:string, port:number, openId: string, onData: (connType: ConnectionType, openId: string, protocolId: number, obj: any) => void): Promise<Client> => {
        return new KcpClient(convId, openId, host, port, onData).connect();
    }

    /**
     * 请求协议信息
     */
    requestEnum = ():Array<ProtoInfo> => {
        return ProtoManager.getRequestProtoInfos();
    }
    /**
     * 获得rsp的proto 信息
     * @param protocolId
     */
    rspProtoInfo = (protocolId: number) => {
        return ProtoManager.getResponseProtoInfo(protocolId)
    }

    buildProtoTypeInfo = (protocolId: number): object => {
        let type = ProtoManager.findReqProto(protocolId);
        return ProtoTypeInfo.build(type);
    }
}

export const ClientApi = new ClientAPI();
