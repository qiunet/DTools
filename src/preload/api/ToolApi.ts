import {DToolsSetting} from "../../renderer/src/common/DToolsSetting";
import {SettingManager} from "../utils/SettingManager";
import {FileUtil} from "../../renderer/src/common/FileUtil";
import Path from "path";
import {ToolsConstants} from "../utils/ToolsConstants";
import * as electron from "electron";
import {IFileNode} from "../../renderer/src/common/IFileNode";
import {SvnEvent, Role} from "../../renderer/src/common/Enums";
import {SvnClient} from "../utils/SvnClient";
import {API} from "./API";
import * as fs from "fs";
import {AiConfigManager, IAIConfig} from "../utils/AiConfig";
import {XmlUtil} from "../utils/XmlUtil";
import {RootExecutor} from "../utils/BehaviorTree";

const ToolApi = {

    isDir: (path: string): boolean => {
        try {
            return fs.statSync(path).isDirectory();
        }catch (e) {
            return false;
        }
    },

    fileExists: (filePath: string): boolean => {
        return fs.existsSync(filePath);
    },

    createAiXmlFile: (fileName: string, desc: string): boolean => {
        let xmlFilePath = Path.join(SettingManager.setting.aiCfgPathSelect.current, fileName + ".xml");
        if (fs.existsSync(xmlFilePath)) {
            return false;
        }
        let executor = new RootExecutor({name: desc});
        XmlUtil.writeXmlFile(executor.toXmlObject(), xmlFilePath);
        return true;
    },

    aiConfigFilePath: (): string => {
      return ToolsConstants.aiConfigFilePath();
    },

    removeAiCfgPath: () => {
        return SettingManager.setting.aiCfgPathSelect.removePath(SettingManager.setting.aiCfgPathSelect.current);
    },

    removeProjectCurrPath: (): string => {
        return SettingManager.setting.projectPathSelect.removePath(SettingManager.setting.projectPathSelect.current);
    },


    removeCfgCurrPath: (): string => {
            return SettingManager.setting.cfgPathSelect.removePath(SettingManager.setting.cfgPathSelect.current);
    },

    useAiConfigPath: (path: string): boolean => {
        return SettingManager.setting.aiCfgPathSelect.usePath(path);
    },

    useCfgPath: (path: string): boolean => {
        return SettingManager.setting.cfgPathSelect.usePath(path);
    },

    useProjectPath: (path: string): boolean => {
        return SettingManager.setting.projectPathSelect.usePath(path);
    },

    convert: (path: string, logger: (info: string) => void): void  => {
        let relativePath: string = path.substring(SettingManager.setting.cfgPathSelect.current.length + 1);
        SettingManager.convert(relativePath, logger);
    },

    copyToEjsDir: (filePath: string) : Promise<void>  => {
        return FileUtil.copy(filePath, Path.join(ToolsConstants.ejsTemplateDir(), Path.basename(filePath)));
    },

    copyToAiCfgDir: (filePath: string) : Promise<void>  => {
         return FileUtil.copy(filePath, Path.join(ToolsConstants.aiConfigDir(), Path.basename(filePath)))
         .then(res => {
             AiConfigManager.reload();
         });
    },

    setting: (): DToolsSetting => {
        return SettingManager.setting;
    },

    openPath: (filePath: string): Promise<string> => {
       return electron.shell.openPath(filePath);
    },

    cfgFileNode: (): Array<IFileNode> => {
        let arr: Array<IFileNode> = [];
        arr.push(SettingManager.getFileNodes());
        return arr;
    },

    aiCfgFileNode: (): Array<IFileNode> => {
        let arr: Array<IFileNode> = [];
        arr.push(SettingManager.aiCfgFileNodes());
        return arr;
    },

    svnClient: (event: SvnEvent, path: string): Promise<string> => {
        switch (event) {
            case SvnEvent.COMMIT:
                return SvnClient.commit(path);
            case SvnEvent.UNLOCK:
                return SvnClient.unlock(path);
            case SvnEvent.LOCK:
                return SvnClient.lock(path);
            case SvnEvent.UPDATE:
                return SvnClient.update(path);
        }
        throw new Error("not support");
    },

    roleChange: (role: Role): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            SettingManager.setting.role = role;
            SettingManager.save();
            resolve();
        });
    },

    /**
     * 得到 aiConfig 的内容.
     */
    aiConfigJson: (): IAIConfig =>  {
        return AiConfigManager.aiConfig;
    },
    /**
     * 读取到的 xml object
     * @param xmlFilePath
     */
    xmlObject: (xmlFilePath: string) : any => {
        return XmlUtil.readXmlFile(xmlFilePath);
    },
    /**
     * 保存xml object 到 地址.
     * @param xmlObject
     * @param xmlFilePath
     */
    saveToXml: (xmlObject: any, xmlFilePath: string) : void => {
        XmlUtil.writeXmlFile(xmlObject, xmlFilePath);
    },
} as API;

export default ToolApi;
