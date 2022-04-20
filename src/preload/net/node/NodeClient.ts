import pb, {Enum, Root, Type} from 'protobufjs';
import {Client, TcpClient} from "../Client";
import {ProtoManager} from "../Proto";

// 从 node_protocol.proto 贴过来
const protoContent = "syntax=\"proto3\";\n" +
    "\n" +
    "message OnlineUserInfo {\n" +
    "  string openId = 1;\n" +
    "  int64 playerId = 2;\n" +
    "}\n" +
    "\n" +
    "enum GmParamType {\n" +
    "  int = 0;\n" +
    "  long = 1;\n" +
    "  string = 2;\n" +
    "}\n" +
    "\n" +
    "message GmParam {\n" +
    "    GmParamType type = 1;\n" +
    "    string name = 2;\n" +
    "    string regex = 3;\n" +
    "    string example = 4;\n" +
    "}\n" +
    "\n" +
    "message GmCommandInfo {\n" +
    "  int32 type = 1;\n" +
    "  string name = 2;\n" +
    "  repeated GmParam params = 3;\n" +
    "}\n" +
    "\n" +
    "// 614 d_tools 请求命令\n" +
    "message GmDToolsCommandReq {\n" +
    "  int64 playerId = 1;\n" +
    "  int32 type = 2;\n" +
    "  repeated string params = 3;\n" +
    "}\n" +
    "\n" +
    "// 615 响应\n" +
    "message GmDToolsCommandRsp {\n" +
    "  bool success = 1;\n" +
    "  string errMsg = 2;\n" +
    "}\n" +
    "\n" +
    "// 612  请求在线的玩家\n" +
    "message GmOnlineUserReq {\n" +
    "\n" +
    "}\n" +
    "// 613\n" +
    "message GmOnlineUserRsp {\n" +
    "  // 所有在线用户\n" +
    "  repeated OnlineUserInfo userList = 1;\n" +
    "}\n" +
    "\n" +
    "// 606 命令首页请求\n" +
    "message GmCommandIndexReq {\n" +
    "\n" +
    "}\n" +
    "// 607 命令首页请求\n" +
    "message GmCommandIndexRsp {\n" +
    "  // 所有命令信息\n" +
    "  repeated GmCommandInfo list = 1;\n" +
    "}\n";

class NodeProto {
    static readonly root:Root = pb.parse(protoContent, {alternateCommentMode: true}).root;

    public static lookupEnum(enumTypeName: string): Enum {
        return this.root.lookupEnum(enumTypeName)
    }

    public static lookupType(typeName: string): Type {
        return this.root.lookupType(typeName);
    }
}

export class NodeClient extends TcpClient {
    static client: NodeClient|undefined;

    constructor(host: string, port: number, onData: (openId: string, protocolId: number, obj: any) => void) {
        super("NodeClient", host, port,  onData, true);
    }
    /**
     * 找到response的 type
     * @param protocolId
     */
    protected findRspType = (protocolId: number) => {
        switch(protocolId) {
            case 613:
                return NodeProto.lookupType('GmOnlineUserRsp');
            case 607:
                return NodeProto.lookupType('GmCommandIndexRsp');
            case 615:
                return NodeProto.lookupType('GmDToolsCommandRsp');
            default:
                return ProtoManager.findRspProto(protocolId)
        }
    }

    destroy = () => {
        this.client?.destroy()
        clearTimeout(this.timer)
        NodeClient.client = undefined;
    }

    getOnlineUser() {
        let type = NodeProto.lookupType("GmOnlineUserReq");
        let message = type.create({});
        this.sendMessage(612, type.encode(message).finish());
    }

    getCommandIndex = () => {
        let type = NodeProto.lookupType("GmCommandIndexReq");
        let message = type.create({});
        this.sendMessage(606, type.encode(message).finish());
    }

    sendCommand = (playerId: number, command: number, params: string[]): string => {
        let type = NodeProto.lookupType("GmDToolsCommandReq");
        let message = type.create({
            playerId: playerId,
            params: params,
            type: command
        });
        return this.sendMessage(614, type.encode(message).finish());
    }
}
//
// NodeClient.client = new NodeClient('localhost', 8881, (openId, protocolId, obj) => {
//     console.log(openId, protocolId, obj)
// })
// NodeClient.client.connect().then(client => {
//     // NodeClient.client?.sendCommand(10, 1, ['1x1'])
//     NodeClient.client?.destroy()
// });
