import {ToolAPI} from "../../../preload/api/ToolApi";

export { }

declare global {
    interface Window {
        // Expose some Api through preload script
        tool_api: ToolAPI
        path: typeof import('path')
        ipcRenderer: import('electron').IpcRenderer
    }
}
