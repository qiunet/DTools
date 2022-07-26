import {ToolAPI} from "../../../preload/api/ToolApi";
import {ClientAPI} from "../../../preload/api/ClientApi";
import {NodeClientAPI} from "../../../preload/api/NodeClientApi";

export { }

declare global {
    interface Window {
        // Expose some Api through preload script
        tool_api: ToolAPI
        client_api: ClientAPI
        path: typeof import('path')
        node_client_api: NodeClientAPI
        ipcRenderer: import('electron').IpcRenderer
    }
}
