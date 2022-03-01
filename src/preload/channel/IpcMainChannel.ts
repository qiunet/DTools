import { ipcMain ,BrowserWindow, IpcMainEvent} from 'electron'
import {MainChannel, RendererChannel} from "./Channel";
import {NetManager} from "../net/Client";
import {NodeClientApi} from "../api/NodeClientApi";

export class IpcMainChannel {
    /***
     * 发消息给渲染线程
     * @param channel
     * @param args
     */
    static sendRendererMsg(channel: RendererChannel, ...args: any[]): void {
        let win = BrowserWindow.getFocusedWindow();
        if (win === null)  {
            throw Error("win was null")
        }
        win.webContents.send(channel, args)
    }

    // static onMainChannel(channel: 'close_client', callback: (event: IpcMainEvent, openId: string) => void): any;
    // static onMainChannel(channel: 'host_port_setting', callback: (event: IpcMainEvent, host: string, port: number) => void): any;
    // static onMainChannel(channel: 'request_msg', callback: (event: IpcMainEvent, openId: string, protocolId: number, data: Uint8Array) => void): any;
    /**
     * 监听渲染线程发过来的消息
     * @param channel
     * @param callback
     */
    static onMainChannel(channel: MainChannel, callback: (event: IpcMainEvent, ...args: any[]) => void): any {
        ipcMain.on(channel, callback);
    }
}
