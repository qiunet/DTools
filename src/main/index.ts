import os from 'os'
import path from 'path'
import { app, BrowserWindow, dialog, Menu, Tray } from 'electron'
import {autoUpdater} from 'electron-updater'
import {ToolsConstants} from "../preload/utils/ToolsConstants";
import * as fs from "fs";
import { env } from 'process';
import axios from "axios";
import * as HttpListener from "./HttpListener";
import {MessageUtil} from "./MessageUtil";

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

let isWin = os.platform() === "win32"
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

    win.loadURL(url);
    win.webContents.openDevTools()
  }
  
  if(isWin){
    win.on('close', (e) => {
      e.preventDefault()
      hideWindow();
    })
    
    let tray = new Tray('icon/icon_512x512.png')
    let contextMenu = createContextMenu();
  
    tray.setToolTip('DTools')
    tray.setContextMenu(contextMenu)
    
    //open tray menu
    tray.on('click', (e, bounds) => {
      showWindow();
    });
  
    tray.on('right-click', (e, bounds) => {
      tray?.popUpContextMenu(contextMenu);
    });
  }
}

function createContextMenu(){
  return Menu.buildFromTemplate(buildOptions())
}

function buildOptions():Electron.MenuItemConstructorOptions[]{
  return [
    {
      label: "打开",
      click(mi, bw, event) { showWindow(); },
    },
    { type: 'separator' },
    {
      label: '退出',
      click() { 
        win?.destroy()
        quitApp(); 
      }
    }
  ];
}

function showWindow(){
  win?.show();
}

function hideWindow(){
  win?.hide();
}

function quitApp(){
  win = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
}

app.whenReady().then(() => ToolsConstants.initTools()).then(createWindow);

app.on('window-all-closed', () => {
  quitApp();
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

HttpListener.listener()

function checkForUpdates() {
  MessageUtil.consoleMsg("#######checkForUpdates#######")
// auto update
  autoUpdater.checkForUpdates()

  autoUpdater.on('error', (err) => {
    MessageUtil.consoleMsg(err)
  })

  autoUpdater.on('update-available', () => {
    MessageUtil.consoleMsg('found new version')
  })

  autoUpdater.on('update-not-available', (name: string) => {
    MessageUtil.consoleMsg('update-not-available: '+name)
  });

  autoUpdater.on('update-downloaded', () => {
    MessageUtil.consoleMsg("update-downloaded")
    dialog.showMessageBox({
      type: 'info',
      title: '应用更新',
      message: '发现新版本，是否更新？',
      buttons: ['是', '否']
    }).then((buttonIndex) => {
      if(buttonIndex.response == 0) {  //选择是，则退出程序，安装新版本
        autoUpdater.quitAndInstall()
        app.quit()
      }
    })
  })
}

// if (app.isPackaged) {
//   app.whenReady().then(() => {
//     setTimeout(checkForUpdates, 4000)
//   })
// }
