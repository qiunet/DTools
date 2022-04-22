import ToolApi from "../../../preload/api/ToolApi";
import { FileUtil } from "./FileUtil";

export class ScriptSetting{
    /**
     * 文件路径
     */
    path:string = '';
    /**
     * 文件内容
     */
    context:string = '';

    public static valueOf(path:string){
        let setting = new ScriptSetting();
        setting.path = path;
        setting.load();
        return setting;
    }

    save(context:string){
        this.context = context;
        FileUtil.writeFile(this.path, context);
    }

    load(){
        if(ToolApi.fileExists(this.path)){
            this.context = FileUtil.readFile(this.path);
        }
    }
}