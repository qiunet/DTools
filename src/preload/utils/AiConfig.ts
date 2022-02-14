/**
 * 条件参数
 */
import {JsonUtil} from "../../renderer/src/common/JsonUtil";
import {FileUtil} from "../../renderer/src/common/FileUtil";
import {ToolsConstants} from "./ToolsConstants";

export interface IConditionParam {
    /**
     * 描述
     */
    desc: string;
    /**
     * 名称
     */
    name: string;
    /**
     * 字段类型
     */
    type: string;
}

/**
 * 一个行为树 action的配置描述接口
 */
export interface IBhtActionConfig {
    desc: string;
    name: string;
}

/**
 * 条件的配置
 */
export interface IConditionConfig {
    /**
     * 条件的参数描述
     */
    paramDoc: Array<IConditionParam>;
    /**
     * 中文描述
     */
    desc: string;
    /***
     * 类型
     */
    type: string;
}

/**
 * AIConfig.json 描述
 */
export interface IAIConfig {
    /**
     * 所有行为树action的描述
     */
    actionDocs: Array<IBhtActionConfig>;
    /**
     * 所有条件的描述
     */
    conditionDocs: Array<IConditionConfig>;
}

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
            this._aiConfig = JsonUtil.stringToJson(FileUtil.readFile(ToolsConstants.aiConfigFilePath()));
        }
        return this._aiConfig;
    }
}
