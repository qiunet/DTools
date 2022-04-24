import { SettingManager } from "./SettingManager";
import {ipcRenderer} from 'electron'
import fs from "fs";

export class ScriptSettingManager{
    
    private static currentPath:string;
    private static script:string;
    
    static loadScript(force:boolean):boolean{
        if(!force){
            if(SettingManager.setting.loginScriptFilePath.current === '' || this.currentPath === SettingManager.setting.loginScriptFilePath.current){
                return false;
            }
        }

        this.currentPath = SettingManager.setting.loginScriptFilePath.current;
        if (this.currentPath.startsWith("http")) {
            this.script = ipcRenderer.sendSync('get_request', this.currentPath);
        }else {
            fs.readFile(SettingManager.setting.loginScriptFilePath.current, "utf-8", (err, data) => {
                this.script = data;
            });
        }
        return true;
    }

    static getScript():string{
        return this.script;
    }

}

if(ScriptSettingManager.loadScript(true)){
    console.log("加载登录脚本成功！")
}