import {StringUtil} from "./StringUtil";
import moment from "moment";

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

    /**
     * 格式化日期为 HH:mm:ss
     * @param date
     */
    public static timeFormat(date: Date): string {
        return +StringUtil.fixedNumber(date.getHours(), 2)+":"+StringUtil.fixedNumber(date.getMinutes(), 2)+":"+StringUtil.fixedNumber(date.getSeconds(), 2);
    }

    /**
     * string to Date
     * @param dateString
     * @param format
     */
    public static stringToDate(dateString: string, format: string = 'yyyy-MM-dd HH:mm:ss'): Date {
        console.log(moment(dateString, format).toDate());
        return moment(dateString, format).toDate();
    }

    /**
     * 日志打印时间 yyyy-MM-dd HH:mm:ss.ms
     * @returns 
     */
    public static logTimeString(): string{
        const date = new Date();
        return this.dateFormat(date) + "." + StringUtil.fixedNumber(date.getMilliseconds(), 3)
    }
}
