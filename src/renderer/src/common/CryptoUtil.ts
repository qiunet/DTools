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
        let md5 = crypto.createHash('md5');
        return md5.update(context, 'utf-8').digest('hex');
    }

}
