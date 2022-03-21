import {ipcMain} from "electron";
import axios from "axios";

export function httpListener() {
    /**
     * args
     * 0 url
     * 1 post data
     */
    ipcMain.on('post_request', (async (event, ...args) => {
        const response: any = await axios.post(args[0], args[1]).catch((err) => {
            return err;
        });
        if (response instanceof Error) {
            event.returnValue = {status: {code: 2, desc: '服务器异常['+response.message+']'}}
        }else {
            event.returnValue = response.data;
        }
    }));

    ipcMain.on('get_request', (async (event, ...args) => {
        const response: any = await axios.get(args[0]).catch((err) => {
            return err;
        });
        event.returnValue = response.data;
    }));
}

