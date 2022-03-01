import {NodeClient} from "../net/node/NodeClient";

export class NodeClientAPI {

    connect = async (host: string, port: number, onData: (openId: string, protocolId: number, obj: any) => void) => {
       if (NodeClient.client !== undefined
           && NodeClient.client.port === port
           && NodeClient.client.host === host
           && NodeClient.client.onData.name === onData.name
       ) {
          return NodeClient.client;
       }else {
           this.destroy();
       }

        NodeClient.client = new NodeClient(host, port, onData);
        return NodeClient.client.connect();
    }

    destroy = () => {
        NodeClient.client?.destroy();
    }

    getOnlineUser = () => {
        NodeClient.client?.getOnlineUser()
    }

    getCommandIndex = () => {
        NodeClient.client?.getCommandIndex()
    }

    sendCommand = (playerId: number, command: number, params: string[]): string => {
        if  (NodeClient.client === undefined) {
            return '没有连接服务器';
        }
        return NodeClient.client.sendCommand(playerId, command, params)
    }
}

export const NodeClientApi = new NodeClientAPI();
