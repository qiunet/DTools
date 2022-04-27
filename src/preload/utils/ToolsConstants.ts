/**
 * 常量
 */
import * as os from "os";
import * as Path from "path";
import * as fs from "fs";
import {FileUtil} from "../../renderer/src/common/FileUtil";
import {Constants} from "excel_to_cfg/lib";
import {DToolsSetting} from "../../renderer/src/common/DToolsSetting";

export class ToolsConstants {
    /**
     * 配置目录
     */
    private static readonly SETTING_DIR = Constants.SETTING_DIR;
    /**
     * 存放ejs的目录
     */
    private static readonly EJS_TEMPLATE_DIR = Constants.EJS_TEMPLATE_DIR;

    /**
     * 配置名称
     */
    private static readonly SETTING_NAME = "setting.json";
    /**
     * 默认的登录脚本文件名
     */
    private static readonly DEFAULT_LOGIN_SCRIPT_FILE_NAME = "login_script.js";

    /**
     * 得到setting 的目录
     */
    private static settingDir(): string {
        return Path.join(os.homedir(), this.SETTING_DIR);
    }

    /**
     * 配置文件路径
     * @private
     */
    private static settingFilePath():string {
        return Path.join(this.settingDir(), this.SETTING_NAME);
    }

    /**
     * 获得ejs 模板路径
     */
    public static ejsTemplateDir(): string {
        return Path.join(this.settingDir(), this.EJS_TEMPLATE_DIR);
    }    

    /**
     * 默认的登录脚本文件路径
     * @returns 
     */
    public static defaultLoginScriptFilePath(){
        return Path.join(this.settingDir(), this.DEFAULT_LOGIN_SCRIPT_FILE_NAME);
    }

    /**
     * 返回对象
     */
    static settingJson(): DToolsSetting {
        const content = FileUtil.readFile(this.settingFilePath());
        return DToolsSetting.valueOf(JSON.parse(content));
    }

    /**
     * 初始化工具.
     */
    public static async initTools() {
        if (fs.existsSync(this.settingFilePath())) {
            return;
        }

        FileUtil.writeFile(Path.join(this.ejsTemplateDir(), "json.ejs"),
    "[\n" +
            "<%_ rows.forEach(function (row, rIndex){ _%>\n" +
            "    {\n" +
            "    <%_ row.cells.forEach(function (cell, cIndex) { _%>\n" +
            "        \"<%= cell.name %>\": <% if (cell.isStringType()) {%>\"<% }%><%-cell.val%><% if (cell.isStringType()) {%>\"<% }%><% if(cIndex < row.cells.length - 1) { %>,<% } %>\n" +
            "     <%_}); _%>\n" +
            "    }<% if(rIndex < rows.length - 1) { %>,<% } %>\n" +
            "<%_ }); _%>\n" +
            "]")
        this.saveSetting(new DToolsSetting());
    }

    /**
     * 保存文件
     * @param setting
     */
    public static saveSetting(setting: DToolsSetting): void {
        FileUtil.writeFile(this.settingFilePath(), JSON.stringify(setting, null, "\t"));
    }
}
