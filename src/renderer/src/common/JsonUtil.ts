
export class JsonUtil {
    /**
     * 将字符串转为json对象
     * @param jsonString json 字符串
     */
    public static stringToJson(jsonString:string): any {
        return JSON.parse(jsonString);
    }

    public static formatPrint(json:JSON):string {
        return JSON.stringify(json, undefined, '\t');
     }
}
