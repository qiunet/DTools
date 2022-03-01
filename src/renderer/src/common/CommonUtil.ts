
export class CommonUtil {
    /****
     * 是否是null 或者未定义
     * @param obj
     * @returns {boolean}
     */
    public static isNullOrUndefined(obj: unknown): boolean {
        return this.isUndefined(obj) || this.isNull(obj);
    }

    /**
     * 是否是undefined
     * @param obj
     * @returns {boolean}
     */
    public static isUndefined(obj: unknown): boolean {
        return typeof(obj) === "undefined";
    }

    /**
     * 是否是null
     * @param obj
     * @returns {boolean}
     */
    public static isNull(obj: unknown): boolean {
        return null === obj;
    }

    /**
     * 是否是nunber
     * @param obj
     * @returns {boolean}
     */
    public static isNumber(obj: unknown): boolean {
        return typeof(obj) === "number";
    }

    /***
     * 是否是string
     * @param obj
     * @returns {boolean}
     */
    public static isString(obj: unknown): boolean {
        return typeof(obj) === "string";
    }

    /***
     * 是否是boolean
     * @param obj
     * @returns {boolean}
     */
    public static isBoolean(obj: unknown): boolean {
        return typeof(obj) === "boolean";
    }

    /**
     * obj 是否在 args 中
     * @param obj
     * @param args
     */
    public static existIn(obj: any, ...args: any[]): boolean {
        for (let arg of args) {
            if (obj === arg) {
                return true;
            }
        }
        return false;
    }
}
