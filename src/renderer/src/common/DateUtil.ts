import {StringUtil} from "./StringUtil";

export class DateUtil {
    /**
     * 当前时间戳
     * @returns {number}
     */
    public static currentTimeMillis(): number {
        return new Date().getTime();
    }

    /***
     * 当前的秒数
     * @returns {number}
     */
    public static currentTimeSeconds(): number {
        return Math.ceil(this.currentTimeMillis()/ 1000);
    }

    /**
     * 格式化日期为 yyyy-MM-dd HH:mm:ss
     * @param date
     */
    public static dateFormat(date: Date): string {
        return StringUtil.fixedNumber(date.getFullYear(), 4)+"-"+StringUtil.fixedNumber((date.getMonth() + 1), 2)+"-"+StringUtil.fixedNumber(date.getDate(), 2) +
            " "+StringUtil.fixedNumber(date.getHours(), 2)+":"+StringUtil.fixedNumber(date.getMinutes(), 2)+":"+StringUtil.fixedNumber(date.getSeconds(), 2);
    }
}
