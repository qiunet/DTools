import {DToolsSetting} from "../../renderer/src/common/DToolsSetting";
import {SettingManager} from "../utils/SettingManager";
import {FileUtil} from "../../renderer/src/common/FileUtil";
import Path from "path";
import {ToolsConstants} from "../utils/ToolsConstants";
import * as electron from "electron";
import {IFileNode} from "../../renderer/src/common/IFileNode";
import {Role, SvnEvent} from "../../renderer/src/common/Enums";
import {SvnClient} from "../utils/SvnClient";
import * as fs from "fs";
import {AiConfigManager, IAIConfig} from "../utils/AiConfig";
import {XmlUtil} from "../utils/XmlUtil";
import {RootExecutor} from "../utils/BehaviorTree";
import {ProtoManager} from "../net/Proto";

export class ToolAPI {
    /**
     * 是否是文件夹
     * @param path
     */
    isDir = (path: string): boolean => {
        try {
         return fs.statSync(path).isDirectory();
        }catch (e) {
            return false;
        }
    }
    /**
     * 文件路径是否存在.
     * @param filePath
     */
    fileExists = (filePath: string): boolean => {
        return fs.existsSync(filePath);
    }
    /**
     * 创建 ai xml 文件
     * @param fileName
     * @param desc
     */
    createAiXmlFile = (fileName: string, desc: string): boolean => {
        let xmlFilePath = Path.join(SettingManager.setting.aiCfgPathSelect.current, fileName + ".xml");
        if (fs.existsSync(xmlFilePath)) {
            return false;
        }
        let executor = new RootExecutor({name: desc});
        XmlUtil.writeXmlFile(executor.toXmlObject(), xmlFilePath);
        return true;
    }
    /**
     * 路径
     */
    aiConfigFilePath = (): string => {
        return ToolsConstants.aiConfigFilePath();
    }

    /**
     * 转化cfg
     * @param path
     * @param logger
     */
    convert = (path: string, logger: (info: string) => void): void  => {
        let relativePath: string = path.substring(SettingManager.setting.cfgPathSelect.current.length + 1);
        SettingManager.convert(relativePath, logger);
    }
    /**
     * copy文件到ejs模板目录
     * @param filePath
     */
    copyToEjsDir = (filePath: string) : Promise<void>  => {
        return FileUtil.copy(filePath, Path.join(ToolsConstants.ejsTemplateDir(), Path.basename(filePath)));
    }
    /**
     * copy文件到 ai config 目录
     * @param filePath
     */
    copyToAiCfgDir = (filePath: string) : Promise<void>  => {
        return FileUtil.copy(filePath, Path.join(ToolsConstants.aiConfigDir(), Path.basename(filePath)))
            .then(res => {
                AiConfigManager.reload();
            });
    }
    /**
     * 获得配置文件
     */
    setting = (): DToolsSetting => {
        return SettingManager.setting;
    }
    /**
     * 打开文件
     * @param filePath
     */
    openPath = (filePath: string): Promise<string> => {
        return electron.shell.openPath(filePath);
    }
    /**
     * 获得配置文件树
     */
    cfgFileNode = (): Array<IFileNode> => {
        let arr: Array<IFileNode> = [];
        arr.push(SettingManager.getFileNodes());
        return arr;
    }
    /**
     * 所有ai config 文件
     */
    aiCfgFileNode = (): Array<IFileNode> => {
        let arr: Array<IFileNode> = [];
        arr.push(SettingManager.aiCfgFileNodes());
        return arr;
    }
    /**
     * svn 操作
     * @param event
     * @param path
     */
    svnClient = (event: SvnEvent, path: string): Promise<string> => {
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
    }
    /**
     * 角色变动
     * @param role
     */
    roleChange = (role: Role): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            SettingManager.setting.role = role;
            SettingManager.save();
            resolve();
        });
    }

    /**
     * 得到 aiConfig 的内容.
     */
    aiConfigJson = (): IAIConfig =>  {
        return AiConfigManager.aiConfig;
    }
    /**
     * 读取到的 xml object
     * @param xmlFilePath
     */
    xmlObject = (xmlFilePath: string) : any => {
        return XmlUtil.readXmlFile(xmlFilePath);
    }
    /**
     * 保存xml object 到 地址.
     * @param xmlObject
     * @param xmlFilePath
     */
    saveToXml = (xmlObject: any, xmlFilePath: string) : void => {
        XmlUtil.writeXmlFile(xmlObject, xmlFilePath);
    }

    loadProto = ():boolean => {
        return ProtoManager.loadProto()
    }
}
const ToolApi = new ToolAPI();
export default ToolApi;
