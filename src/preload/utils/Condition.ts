export class Condition {
    /**
     * 类型
     * @private
     */
    private readonly data: { [key: string]: string } = {};

    constructor(data: { [key: string]: string }) {
        this.data = data;
    }

    /**
     * 增加属性
     * @param name
     * @param value
     */
    public addAttribute(name: string, value: string): void {
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
     * 是否是not
     */
    public isNot(): boolean {
        return "true" === this.getAttribute("not");
    }
    /**
     * 取反
     */
    public not(): void {
        this.addAttribute("not", "true");
    }
    /**
     * 移除取反
     */
    public removeNot(): void {
        delete this.data.not;
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
    private conditions: Array<Condition> = [];
    /**
     * 或的conditions
     * @private
     */
    private orConditions: Conditions | undefined;

    constructor(data: string) {
        let number = data.indexOf("||");
        if (number === -1) {
            number = data.length;
        }
        let jsonData = data.substring(0, number).replaceAll("'", "\"");
        let arr = JSON.parse(jsonData);
        for (let arrElement of arr) {
            this.conditions.push(new Condition(arrElement));
        }

        if (number !== data.length) {
            this.orConditions = new Conditions(data.substring(number + 2));
        }
    }

    /**
     * 是否为空
     */
    public isEmpty(): boolean {
        return this.conditions.length === 0;
    }
    /**
     * 添加 与 条件
     * @param condition
     */
    public addCondition(condition: Condition): void {
        this.conditions.push(condition);
    }

    /**
     * 或一个conditions
     * @param conditions
     */
    public orAConditions(conditions: Conditions): void {
        this.orConditions = conditions;
    }

    /**
     * 转字符串
     */
    public toString(): string {
        let result: string = "[";
        for (let i = 0; i < this.conditions.length; i++) {
            result += this.conditions[i].toString();
            if (i < this.conditions.length - 1) {
                result += ", ";
            }
        }
        result += "]";
        result = result.replaceAll("\"", "'");
        if (undefined !== this.orConditions) {
            result += " || ";
            result += this.orConditions.toString();
        }
        return result;
    }
}
