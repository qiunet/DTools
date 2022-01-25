import {StringUtil} from "../../renderer/src/common/StringUtil";
import {IFileNode} from "../../renderer/src/common/IFileNode";
import {ToolsConstants} from "./ToolsConstants";
import {DToolsSetting} from "../../renderer/src/common/DToolsSetting";
import {FileNode, FileUtil} from "../../renderer/src/common/FileUtil";
import fs from "fs";
import {ExcelToCfg} from "excel_to_cfg/lib";

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
     * 使用该路径
     * @param path
     * @return 是否是新增
     */
    public static useCfgPath(path: string): boolean {
        if (path.endsWith("/")) {
            path = path.substring(0, path.length - 1);
        }
        let newPath = false;
        if (! SettingManager._setting.getCfgPaths().find((str, index, objs) => {
            if (str === path) {
                return true;
            }
        })) {
            SettingManager._setting.getCfgPaths().push(path);
            newPath = true;
        }
        SettingManager._setting.currCfgPath = path;
        SettingManager.save();
        return newPath;
    }
    /**
     * 使用该路径
     * @param path
     * @return 是否是新增
     */
    public static useProjectPath(path: string): boolean {
        if (path.endsWith("/")) {
            path = path.substring(0, path.length - 1);
        }
        let newPath = false;
        if (! SettingManager._setting.getProjectPaths().find((str, index, objs) => {
            if (str === path) {
                return true;
            }
        })) {
            SettingManager._setting.getProjectPaths().push(path);
            newPath = true;
        }
        SettingManager._setting.currProjectPath = path;
        SettingManager.save();
        return newPath;
    }

    /**
     * 删除某个path
     * @param path
     */
    public static removeCfgPath(path: string): string {
        let currPath: string = SettingManager._setting.getCurrCfgPath();
        SettingManager._setting.getCfgPaths().forEach((val, index, arr) => {
            if (val !== path) {
                return;
            }
            arr.splice(index, 1);
            if (currPath === path && arr.length >= 1) {
                SettingManager._setting.setCurrCfgPath(arr[0]);
            }else {
                SettingManager._setting.setCurrCfgPath("");
            }
        });
        SettingManager.save();
        return SettingManager._setting.getCurrCfgPath();
    }
    /**
     * 删除某个path
     * @param path
     */
    public static removeProjectPath(path: string):string {
        let currPath: string = SettingManager._setting.getCurrProjectPath();
        SettingManager._setting.getProjectPaths().forEach((val, index, arr) => {
            if (val !== path) {
                return;
            }
            arr.splice(index, 1);
            if (currPath === path && arr.length >= 1) {
                SettingManager._setting.setCurrProjectPath(arr[0]);
            }else {
                SettingManager._setting.setCurrProjectPath("");
            }
        });
        SettingManager.save();
        return SettingManager._setting.getCurrProjectPath();
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

        let excelToCfg = new ExcelToCfg(SettingManager._setting.getRole(),relativePath , SettingManager._setting.getCurrCfgPath(), [SettingManager._setting.getCurrProjectPath()], logger);
        excelToCfg.convert();
    }

    /**
     * 保存现有的setting
     */
    public static save(): void {
        ToolsConstants.saveSetting(SettingManager._setting);
    }
}
