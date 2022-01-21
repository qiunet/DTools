import {DToolsSetting} from "../../renderer/src/common/DToolsSetting";
import {IFileNode} from "../../renderer/src/common/IFileNode";
import {SvnEvent} from "../../renderer/src/common/Enums";

export interface API {
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
}
