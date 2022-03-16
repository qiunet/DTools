import {CommonUtil} from "./CommonUtil";

export class StringUtil {
    /**
     * 是否是空字符串
     * @param string
     */
    public static isEmpty(string: string|null|undefined): boolean {
        return string === null || string === undefined || string.trim().length == 0;
    }

    /**
     * 判断是否是数值类型
     * @param string
     */
    public static isNumber(string: string): boolean {
        return ! isNaN(Number(string));
    }

    /**
     * 对数字进行固定长度输出字符串 不够前面补0
     * @param val
     * @param length
     */
    public static fixedNumber(val: number, length: number) : string{
        return (Array(length).join("0") + val).slice(-length);
    }

    /**
     * 是否是java的数字类型
     * @param javaType
     */
    public static isJavaNumberType(javaType: string): boolean {
        javaType = javaType.toLowerCase();
        return javaType === 'int' || javaType === 'long'
            || javaType.endsWith("int") || javaType.endsWith("long");
    }

    /**
     * 正则校验
     * @param val
     * @param regex
     */
    public static regexTest(val: string, regex: string): boolean {
        return this.dRegexTest(val, new RegExp(regex));
    }
    /**
     * 正则校验
     * @param val
     * @param regex
     */
    public static dRegexTest(val: string, regex: RegExp): boolean {
        return regex.test(val);
    }

    /**
     * java hash code
     * @param val
     */
    public static javaHashCode(val: string): number {
        let hash = 0, i, chr;
        if (val.length === 0) return hash;
        for (i = 0; i < val.length; i++) {
            chr = val.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash
    }
}
