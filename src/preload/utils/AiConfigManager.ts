import {JsonUtil} from "../../renderer/src/common/JsonUtil";
import {ipcRenderer} from 'electron';
import {IAIConfig} from "./AiConfig";
import {SettingManager} from "./SettingManager";
import fs from "fs";

export class AiConfigManager {
    /**
     * ai Config
     * @private
     */
    private static _aiConfig: IAIConfig;
    /**
     * 获得单例 对象
     */
    static get aiConfig(): IAIConfig {
        if (this._aiConfig == null) {
            this.reload();
        }
        return this._aiConfig;
    }

    static reload() {
        if (SettingManager.setting.aiJsonCfgPathSelect.current != '') {
            if (SettingManager.setting.aiJsonCfgPathSelect.current.startsWith("http")) {
                this._aiConfig = ipcRenderer.sendSync('get_request', SettingManager.setting.aiJsonCfgPathSelect.current);
            }else {
                fs.readFile(SettingManager.setting.aiJsonCfgPathSelect.current, "utf-8", (err, data) => {
                    this._aiConfig = JsonUtil.stringToJson(data);
                })
            }
        }

    }
}
