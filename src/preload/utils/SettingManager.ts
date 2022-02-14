import {StringUtil} from "../../renderer/src/common/StringUtil";
import {IFileNode} from "../../renderer/src/common/IFileNode";
import {ToolsConstants} from "./ToolsConstants";
import {FileNode, FileUtil} from "../../renderer/src/common/FileUtil";
import {ExcelToCfg} from "excel_to_cfg/lib";
import {DToolsSetting} from "../../renderer/src/common/DToolsSetting";
import {CommonUtil} from "../../renderer/src/common/CommonUtil";
import fs from "fs";

export class SettingManager {
    private static _setting: DToolsSetting;
    /**
     * 获得所有的列表
     */
    public static getFileNodes(): IFileNode {
        if (StringUtil.isEmpty(SettingManager.setting.cfgPathSelect.current)) {
            return new FileNode("None", true);
        }

        return FileUtil.listDir(SettingManager.setting.cfgPathSelect.current, (file: string) => {
            return file.endsWith(".xlsx");
        });
    }

    /**
     * 获得所有的列表
     */
    public static aiCfgFileNodes(): IFileNode {
        if (StringUtil.isEmpty(SettingManager.setting.aiCfgPathSelect.current)) {
            return new FileNode("None", true);
        }

        return FileUtil.listDir(SettingManager.setting.aiCfgPathSelect.current, (file: string) => {
            return file.endsWith(".xml");
        });
    }

    /**
     * 获得setting
     */
    public static get setting(): DToolsSetting {
        if (CommonUtil.isNullOrUndefined(SettingManager._setting)) {
            SettingManager._setting = ToolsConstants.settingJson();
        }
        return SettingManager._setting;
    }

    /**
     * 转换文件
     * @param relativePath
     * @param logger
     */
    public static convert(relativePath: string, logger: (info: string) => void): void {
     ExcelToCfg.roleConvert(SettingManager.setting.role, SettingManager.setting.cfgPathSelect.current, relativePath , [SettingManager.setting.projectPathSelect.current], logger);
    }

    /**
     * 保存现有的setting
     */
    public static save(): void {
        ToolsConstants.saveSetting(SettingManager.setting);
    }
}
