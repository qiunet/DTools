export class MathUtil {
    /***
     * 强转一个数值类型为int
     * @param {number} num
     * @returns {number}
     */
    public static numberToInt(num: number): number {
        return num & 0xFFFFFFFF;
    }

    /***
     * 强转一个数值类型为byte
     * @param {number} num
     * @returns {number}
     */
    public static numberToByte(num: number): number {
        return num & 0xFF;
    }

    /***
     * 强转一个数值类型为short
     * @param {number} num
     * @returns {number}
     */
    public static numberToShort(num: number): number {
        return num & 0xFFFF;
    }

    /***
     * 强转一个数值类型为long
     * @param {number} num
     * @returns {number}
     */
    public static numberToLong(num: number): number {
        return num & 0xFFFFFFFFFFFFFFFF;
    }

    /***
     * 随机一个区间数
     * @param {number} start
     * @param {number} end
     * @returns {number} 结果 start <= ret < end
     */
    public static random(start:number , end: number) :number{
        return Math.random() * (end - start) + start;
    }

    /**
     * 截去小数位
     */
    public static parseInt(num: number): number {
        if (num > 0) {
            return num >> 0;
        } else {
            return Math.ceil(num);
        }
    }
    /**
     * 两点间的距离
     * @param _p1
     * @param _p2
     * @return
     */
    public static getDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    }
    /**
     * 两点间的弧度：x正方形为0，顺时针为正
     * @param p1
     * @param p2
     * @return
     *
     */
    public static getLineRadians(x1: number, y1: number, x2: number, y2: number): number {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    /**
     * An ASCII byte is a byte in the range 0x00 to 0x7F, inclusive.
     * @param {number} a The number to test.
     * @return {boolean} True if a is in the range 0x00 to 0x7F, inclusive.
     */
    public static isASCIIByte(a: number):boolean {
        return 0x00 <= a && a <= 0x7F;
    }

    public static inRange(a:number, min:number, max:number) : boolean{
        return min <= a && a <= max;
    }
}