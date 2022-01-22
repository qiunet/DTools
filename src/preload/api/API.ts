import {DToolsSetting} from "../../renderer/src/common/DToolsSetting";
import {IFileNode} from "../../renderer/src/common/IFileNode";
import {SvnEvent} from "../../renderer/src/common/Enums";
import {Role} from "../utils/ExcelToCfg";

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
}
