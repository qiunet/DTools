import { DateUtil } from "./DateUtil";

export class ConsoleUtil{
    public static log(message?: any, ...optionalParams: any[]){
        optionalParams.unshift(`[${DateUtil.logTimeString()}] ${message}`);
        console.log.apply(console, optionalParams)
    }
}