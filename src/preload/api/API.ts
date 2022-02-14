import {DToolsSetting} from "../../renderer/src/common/DToolsSetting";
import {IFileNode} from "../../renderer/src/common/IFileNode";
import {Role, SvnEvent} from "../../renderer/src/common/Enums";
import {IAIConfig} from "../utils/AiConfig";

/**
 * API 还是有必要的.
 * 可以更好的让ide推断类型.
 */
export interface API {
    /**
     * 是否是文件夹
     * @param path
     */
    isDir: (path: string) => boolean;
    /**
     * 文件路径是否存在.
     * @param path
     */
    fileExists: (path: string) => boolean;
    /**
     * 路径
     */
    aiConfigFilePath: () => string;

    /**
     * 创建 ai xml 文件
     * @param fileName
     */
    createAiXmlFile: (fileName: string, desc: string) => boolean;
    /**
     * 增加cfg path
     * @param path
     */
    useCfgPath: (path: string) => boolean;
    /**
     * 增加配置 path
     * @param path
     */
    useProjectPath: (path: string) => boolean;
    /**
     * ai config 使用某个路径
     * @param path
     */
    useAiConfigPath: (path: string) => boolean;
    /**
     * 删除ai config 路径
     */
    removeAiCfgPath: () => string;
    /**
     * 删除setting中的路径.
     * @param path
     * @return 新的当前路径
     */
    removeCfgCurrPath: () => string;
    /**
     * 删除setting中的路径.
     * @param path
     * @return 新的当前路径
     */
    removeProjectCurrPath: () => string;
    /**
     * 获得配置文件
     */
    setting: () => DToolsSetting;
    /**
     * 打开文件
     * @param filePath
     */
    openPath: (filePath: string) => Promise<string>;
    /**
     * 获得配置文件树
     */
    cfgFileNode: () => Array<IFileNode>;
    /**
     * 所有ai config 文件
     */
    aiCfgFileNode: () => Array<IFileNode>;
    /**
     * svn 操作
     * @param event
     * @param path
     */
    svnClient: (event: SvnEvent, path: string) => Promise<string>;
    /**
     * copy文件到ejs模板目录
     * @param filePath
     */
    copyToEjsDir: (filePath: string) => Promise<void>;
    /**
     * copy ai config to directory.
     * @param filePath
     */
    copyToAiCfgDir: (filePath: string) => Promise<void>;
    /**
     * 转化cfg
     * @param path
     * @param logger
     */
    convert: (path: string, logger: (info:string) => void) => void;
    /**
     * 角色变动
     * @param role
     */
    roleChange: (role: Role) => Promise<void>;
    /**
     * 得到 aiConfig 的内容.
     */
    aiConfigJson: () => IAIConfig;
    /**
     * 读取到的 xml object
     * @param xmlFilePath
     */
    xmlObject: (xmlFilePath: string) => any;
    /**
     * 保存xml object 到 地址.
     * @param xmlObject
     * @param xmlFilePath
     */
    saveToXml: (xmlObject: any, xmlFilePath: string) => void;
}
