import {BrowserWindow} from 'electron';

export class MessageUtil {
    /**
     * 让渲染进程打印消息
     * @param message
     */
    public static consoleMsg(message: any) {
        console.log("console send message:", message)
        BrowserWindow.getFocusedWindow()?.webContents.send('consoleMsg', message);
    }
}
