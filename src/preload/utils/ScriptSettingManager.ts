import { ScriptSetting } from "../../renderer/src/common/ScriptSetting";

export class ScriptSettingManager{

    private static settings:any = {};

    private static getSetting(path:string):ScriptSetting{
        let setting = this.settings[path];
        if(!setting){
            setting = this.settings[path] = ScriptSetting.valueOf(path);
        }
        return setting;
    }

    /**
     * 获取逻辑脚本内容
     * @param path      脚本路径
     * @returns 逻辑脚本内容
     */
    public static getScript(path:string):string{
        return this.getSetting(path).context;
    }
    /**
     * 保存逻辑脚本内容
     * @param path      脚本路径
     * @param context   脚本内容
     */
    public static saveScript(path:string, context:string){
        this.getSetting(path).save(context);
    }

    /**
     * 重载脚本内容
     * @param path      脚本路径
     */
    public static reloadScript(path:string){
        this.getSetting(path).load();
    }
}