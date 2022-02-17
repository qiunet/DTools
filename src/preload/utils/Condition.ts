import {IAIConfig, IConditionConfig, IConditionParam} from "./AiConfig";

export class Condition {
    /**
     * 类型
     * @private
     */
    private readonly data: Record<string, any> = {};

    constructor(data: { [key: string]: string }) {
        this.data = data;
    }

    /**
     * 增加属性
     * @param name
     * @param value
     */
    public setAttribute(name: string, value: any): void {
        this.data[name] = value;
    }
    /**
     * 得到某个属性名
     * @param name
     */
    public getAttribute(name: string): string {
        return this.data[name];
    }

    /**
     * 得到描述
     */
    public get desc(): string {
        return this.findConditionConfig().desc;
    }

    /**
     * 找到config
     */
    public findConditionConfig(): IConditionConfig {
        let aiConfig: IAIConfig = window.tool_api.aiConfigJson();
        let find = aiConfig.conditionDocs.find((value => value.type === this.getAttribute('type')));
        if (find === undefined) {
            throw new Error("not find type for "+this.getAttribute('type'));
        }
        return find;
    }

    /**
     * 是否是not
     */
    public get isNot(): boolean {
        return "true" === this.getAttribute("not");
    }
    /**
     * 取反
     */
    public setNot(): void {
        this.setAttribute("not", "true");
    }
    /**
     * 移除取反
     */
    public removeNot(): void {
        delete this.data.not;
    }

    /**
     * 去掉 type 和 not的属性描述
     */
    private attrs(keyGetter: (param: IConditionParam) => string) : Record<string, any> {
        let result: Record<string, any> = {};
        let iConditionConfig = this.findConditionConfig();
        for (let key in this.data) {
            if (key === 'type' || key === 'not') {
                continue;
            }
            let param = iConditionConfig.paramDoc.find(doc => doc.name === key);
            if (param === undefined) {
                console.error('Not param doc for type ['+this.getAttribute('type')+'] param ' + key)
                continue;
            }
            result[keyGetter(param)] = this.data[key];
        }
        return result;
    }
    /**
     * 去掉 type 和 not的属性 使用字符串描述
     */
    public get attrs_desc() : string {
        return JSON.stringify(this.attrs(param => param.desc));
    }

    /**
     * 原本的key value
     */
    public getAttrKeyValue(): Record<string, any> {
        return this.attrs(param => param.name);
    }

    /**
     * 转字符串
     */
    public toString(): string {
        return JSON.stringify(this.data);
    }
}
/**
 * 一组condition
 * 与关系
 */
export class Conditions {
    /**
     *
     * @private
     */
    conditionArray: Array<Condition> = [];

    constructor(data: string) {
        if (data === undefined || '' === data) {
            return;
        }
        let arr = JSON.parse(data);
        for (let arrElement of arr) {
            this.conditionArray.push(new Condition(arrElement));
        }
    }

    /**
     * 是否为空
     */
    public isEmpty(): boolean {
        return this.conditionArray.length === 0;
    }
    /**
     * 添加 与 条件
     * @param condition
     */
    public addCondition(condition: Condition): void {
        this.conditionArray.push(condition);
    }

    /**
     * 删除index的条件
     * @param index
     */
    public delCondition(index: number) {
        this.conditionArray.splice(index, 1);
    }

    /**
     * 获得指定下标的condition
     * @param index
     */
    public getCondition(index: number): Condition {
        return this.conditionArray[index];
    }

    /**
     * 转字符串
     */
    public toString(): string {
        if (this.isEmpty()) {
            return '[]';
        }
        let result: string = "[";
        for (let i = 0; i < this.conditionArray.length; i++) {
            result += this.conditionArray[i].toString();
            if (i < this.conditionArray.length - 1) {
                result += ", ";
            }
        }
        result += "]";
        result = result.replaceAll("\"", "'");
        return result;
    }
}
