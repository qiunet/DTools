import { contextBridge, ipcRenderer } from 'electron'
import ToolApi from "./api/ToolApi";
import Path from "path";
import {ClientApi} from "./api/ClientApi";
import {NodeClientApi} from "./api/NodeClientApi";


contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))
contextBridge.exposeInMainWorld("node_client_api", NodeClientApi);
contextBridge.exposeInMainWorld("client_api", ClientApi);
contextBridge.exposeInMainWorld("tool_api", ToolApi);
contextBridge.exposeInMainWorld('path', Path)

// `exposeInMainWorld` can not detect `prototype` attribute and methods, manually patch it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj)

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue

    if (typeof value === 'function') {
      // Some native API not work in Renderer-process, like `NodeJS.EventEmitter['on']`. Wrap a function patch it.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args)
      }
    } else {
      obj[key] = value
    }
  }
  return obj
}
