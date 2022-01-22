import {DToolsSetting} from "../../renderer/src/common/DToolsSetting";
import {SettingManager} from "../utils/SettingManager";
import {FileNode, FileUtil} from "../../renderer/src/common/FileUtil";
import Path from "path";
import {ToolsConstants} from "../utils/ToolsConstants";
import * as electron from "electron";
import {IFileNode} from "../../renderer/src/common/IFileNode";
import {SvnEvent} from "../../renderer/src/common/Enums";
import {SvnClient} from "../utils/SvnClient";
import setting from "../../renderer/src/views/Setting.vue";
import {Role} from "../utils/ExcelToCfg";
import {API} from "./API";

const ToolApi = {
    convert: (path: string, logger: (info: string) => void): void  => {
        SettingManager.convert(path, logger);
    },

    copyToEjsDir: (filePath: string) : Promise<void>  => {
        return FileUtil.copy(filePath, Path.join(ToolsConstants.ejsTemplateDir(), Path.basename(filePath)));
    },

    setting: (): DToolsSetting => {
        return SettingManager.getSetting();
    },

    openPath: (filePath: string): Promise<string> => {
       return electron.shell.openPath(filePath);
    },

    cfgFileNode: (): Array<IFileNode> => {
        let arr: Array<IFileNode> = [];
        arr.push(SettingManager.getFileNodes());
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
            SettingManager.getSetting().role = role;
            SettingManager.save();
            resolve();
        });
    }
} as API;

export default ToolApi;
