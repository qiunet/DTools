import {CommonUtil} from "./CommonUtil";

export class StringUtil {
    /**
     * 是否是空字符串
     * @param string
     */
    public static isEmpty(string: string): boolean {
        return CommonUtil.isNullOrUndefined(string) || string.trim().length == 0;
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
        return javaType === 'int' || javaType === 'long';
    }

    /**
     * 正则校验
     * @param val
     * @param regex
     */
    public static regexTest(val: string, regex: string): boolean {
        return new RegExp(regex).test(val);
    }
}
