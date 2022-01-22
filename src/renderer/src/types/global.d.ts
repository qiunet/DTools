import {API} from "../../../preload/api/API";

export { }

declare global {
    interface Window {
        // Expose some Api through preload script
        tool_api: API
        path: typeof import('path')
        ipcRenderer: import('electron').IpcRenderer
    }
}
