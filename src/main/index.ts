import os from 'os'
import path from 'path'
import { app, BrowserWindow, ipcMain} from 'electron'
import {ToolsConstants} from "../preload/utils/ToolsConstants";
import * as fs from "fs";
import { env } from 'process';
import axios from "axios";

// https://stackoverflow.com/questions/42524606/how-to-get-windows-version-using-node-js
const isWin7 = os.release().startsWith('6.1')
if (isWin7) app.disableHardwareAcceleration()

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

if (app.isPackaged && (os.platform() === 'darwin' || os.platform() === 'linux')) {
  // 类linux特殊环境变量设定.
  env.PATH = "/usr/local/bin:" + env.PATH;
}

let win: BrowserWindow | null = null

async function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "DTools",
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
    },
  })

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  } else {
    const pkg = await import('../../package.json')
    const url = `http://${pkg.env.HOST || '127.0.0.1'}:${pkg.env.PORT}`

    win.loadURL(url)
    win.webContents.openDevTools()
  }
}

app.whenReady().then(() => ToolsConstants.initTools()).then(createWindow);

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('second-instance', () => {
  if (win) {
    // someone tried to run a second instance, we should focus our window.
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

ipcMain.on('login_request', (async (event, ...args) => {
    const response: any = await axios.post(args[0], args[1]).catch((err) => {
      return err;
    });
    if (response instanceof Error) {
      event.returnValue = {status: {code: 2, desc: '服务器异常['+response.message+']'}}
    }else {
      event.returnValue = response.data;
    }
}));


ipcMain.on('proto_request', ((event, url) => {
  axios.get(url).then(response => {
        event.sender.send('proto_response', response.data)
      })
}));

ipcMain.on('ai_config_request',  (async (event, url) => {
  const response = await axios.get(url)
  event.returnValue = response.data;
}));

// @TODO
// auto update
/* if (app.isPackaged) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) =>
      // maybe you need to record some log files.
      console.error('Failed check update:', e)
    )
} */
