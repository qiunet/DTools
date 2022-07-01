import {ipcMain} from "electron";
import { ConsoleUtil } from "../renderer/src/common/ConsoleUtil";
import { KcpClient } from "../preload/net/kcp/KcpClient";


let getWindow:Function;
let clients:any = {};
export function listener(windowFun:Function) {
    getWindow = windowFun;
    /**
     * args
     * 0 openId
     * 1 host
     * 2 port
     * 3 conv
     */
    ipcMain.on('kcp_connect', (async (event, ...args) => {
        const openId:string = args[0];
        const promise = new KcpClient(openId, args[1], args[2], args[3], onData).connect();
        promise.then(client => {
            client && (clients[openId] = client);
        })
        event.returnValue = {};
    }));

    ipcMain.on('kcp_send',  (event, ...args) => {
        ConsoleUtil.log(`Kcp Message bytes:${args[3]}`)
        const openId:string = args[0];
        const client:KcpClient = clients[openId];
        client?.sendData(args[1], args[2]);
    });

    ipcMain.on('kcp_disconnect', (event, ...args) => {
        const openId:string = args[0];
        const client:KcpClient = clients[openId];
        delete clients[openId]
        ConsoleUtil.log(`kcp_disconnect openId:${args[0]} client:${client}`)
        client?.destroy()
    })
}

function onData(openId: string, protocolId: number, data: any){
    getWindow().webContents.send("kcp_server_data", openId, protocolId, data)
}

