/**
 * 条件参数
 */

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

export interface IBhtActionParam {
    name: string;
    desc: string
    type: string;
    regex: string;
    min: number;
    max: number;
}

/**
 * 一个行为树 action的配置描述接口
 */
export interface IBhtActionConfig {
    desc: string;
    name: string;
    params: Array<IBhtActionParam>;
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


