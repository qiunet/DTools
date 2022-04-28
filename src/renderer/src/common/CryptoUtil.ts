import crypto from "crypto";

/**
 * 加密工具类
 */
export class CryptoUtil {
    /**
     * md5加密
     * @param context
     */
    public static md5(context: string): string {
        return this.encrypt('md5', context);
    }

    /**
     * sha1加密
     * @param context 加密内容
     * @returns 
     */
    public static sha1(context: string): string {
        return this.encrypt('sha1', context);
    }

    /**
     * 加密
     * @param algorithm 加密算法
     * @param context   加密内容
     * @returns 加密后字符串
     */
    public static encrypt(algorithm:string, context:string):string{
        let hash = crypto.createHash(algorithm);
        return hash.update(context, 'utf-8').digest('hex');
    }

}
