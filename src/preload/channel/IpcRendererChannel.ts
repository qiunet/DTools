import {MainChannel, RendererChannel} from "./Channel";

export class IpcRendererChannel {
    static sendMainMsg(channel: MainChannel, ...args: any[]): void {
        window.ipcRenderer.send(channel, args)
    }

    static onRendererChannel(channel: RendererChannel, callback: (event: Event, ...args: any[]) => void): void {
        window.ipcRenderer.on(channel, callback);
    }


    static onceRendererChannel(channel: RendererChannel, callback: (event: Event, ...args: any[]) => void): void {
        window.ipcRenderer.once(channel, callback);
    }
}
