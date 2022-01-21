import {StringUtil} from "../../renderer/src/common/StringUtil";
import {IFileNode} from "../../renderer/src/common/IFileNode";
import {ToolsConstants} from "./ToolsConstants";
import {DToolsSetting} from "../../renderer/src/common/DToolsSetting";
import {FileNode, FileUtil} from "../../renderer/src/common/FileUtil";
import {ExcelToCfg} from "./ExcelToCfg";
import fs from "fs";
import {log} from "util";

export class SettingManager {
    private static readonly _setting: DToolsSetting = ToolsConstants.settingJson();

    /**
     * 获得所有的列表
     */
    public static getFileNodes(): IFileNode {
        if (StringUtil.isEmpty(SettingManager._setting.getCurrCfgPath())) {
            return new FileNode("None", true);
        }

        return FileUtil.listDir(SettingManager._setting.getCurrCfgPath(), (file: string) => {
            return file.endsWith(".xlsx");
        });
    }

    /**
     * 获得setting
     */
    public static getSetting(): DToolsSetting {
        return SettingManager._setting;
    }

    /**
     * 添加路径
     * @param path
     */
    public static addCfgPath(path: string): void {
        if (SettingManager._setting.getCfgPaths().find((str, index, objs) => {
            if (str === path) {
                return true;
            }
        })) {
            return;
        }
        SettingManager._setting.getCfgPaths().push(path);
    }
    /**
     * 添加路径
     * @param path
     */
    public static addProjectPath(path: string): void {
        if (SettingManager._setting.getProjectPaths().find((str, index, objs) => {
            if (str === path) {
                return true;
            }
        })) {
            return;
        }
        SettingManager._setting.getProjectPaths().push(path);
    }

    /**
     * 删除某个path
     * @param path
     */
    public static removeCfgPath(path: string) {
        let currPath: string = SettingManager._setting.getCurrCfgPath();
        SettingManager._setting.getCfgPaths().forEach((val, index, arr) => {
            if (val !== path) {
                return;
            }
            arr.splice(index, 1);
            if (currPath === path && arr.length > 1) {
                SettingManager._setting.setCurrCfgPath(arr[0]);
            }else {
                SettingManager._setting.setCurrCfgPath("");
            }
        });
    }
    /**
     * 删除某个path
     * @param path
     */
    public static removeProjectPath(path: string) {
        let currPath: string = SettingManager._setting.getCurrProjectPath();
        SettingManager._setting.getProjectPaths().forEach((val, index, arr) => {
            if (val !== path) {
                return;
            }
            arr.splice(index, 1);
            if (currPath === path && arr.length > 1) {
                SettingManager._setting.setCurrProjectPath(arr[0]);
            }else {
                SettingManager._setting.setCurrProjectPath("");
            }
        });
    }

    /**
     * 转换文件夹
     * @param path
     * @param logger
     */
    public static convertDir(path: string, logger: (info: string) => void): void {
        let files = fs.readdirSync(path);
        for (let file of files) {
            this.convert(file, logger);
        }
    }
    /**
     * 转换文件
     * @param path
     * @param logger
     */
    public static convert(path: string, logger: (info: string) => void): void {
        if (fs.statSync(path).isDirectory()) {
            return this.convertDir(path, logger);
        }

        let relativePath: string = path.substring(SettingManager._setting.getCurrCfgPath().length + 1);

        let excelToCfg = new ExcelToCfg(SettingManager._setting.getRole(),relativePath , SettingManager._setting.getCurrCfgPath(), SettingManager._setting.getCurrProjectPath(), logger);
        excelToCfg.convert();
    }
}
