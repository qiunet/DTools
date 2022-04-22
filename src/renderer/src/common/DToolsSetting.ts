import {Role} from "./Enums";
import {SettingManager} from "../../../preload/utils/SettingManager";
import {CommonUtil} from "./CommonUtil";
import { ToolsConstants } from "../../../preload/utils/ToolsConstants";
export class SelectSetting {

    defaultVal: string|undefined = undefined;
    /**
     * 当前选定数据
     */
    current: string = '';
    /**
     * 列表数据
     */
    list: Set<string> = new Set();

    static valueOf(data: any, defaultVal?: string) {
        let setting = new SelectSetting();
        if(data !== undefined) {
            if (! CommonUtil.isNullOrUndefined(data.current)) {
                setting.current = data.current;
            }
            if (! CommonUtil.isNullOrUndefined(data.list)) {
                setting.list = new Set(data.list);
            }
        }
        setting.defaultVal = defaultVal;
        if (setting.current === '' && setting.defaultVal !== undefined) {
            setting.current = setting.defaultVal;
            setting.list.add(setting.defaultVal);
        }
        return setting;
    }

    /**
     * 使用该路径
     * @param path
     * @return 是否是新增
     */
    usePath = (path: string): boolean => {
        if (path.endsWith("/")) {
            path = path.substring(0, path.length - 1);
        }
        this.current = path;
        this.list.add(path);
        SettingManager.save();
        return this.list.has(path);
    }
    /**
     * 删除current path
     * @param path
     */
    removeCurrentPath = (): string => {
        return this.removePath(this.current);
    }
    /**
     * 删除某个path
     * @param path
     */
    removePath = (path: string): string => {
        this.list.delete(path);

        if (this.current === path) {
            if (this.list.size == 0) {
                this.current = this.defaultVal !== undefined ? this.defaultVal: '';
            }else {
                const [first] = this.list;
                this.current = first;
            }
        }
        SettingManager.save();
        return this.current;
    }

    /**
     * 覆盖生成json用的.
     */
    toJSON() {
        return {
            current: this.current,
            list: Array.from(this.list)
        }
    }
}


export class DToolsSetting {
    /**
     * 角色
     */
    role: Role = Role.SERVER;
    /**
     * excel 路径
     */
    cfgPathSelect: SelectSetting = new SelectSetting();
    /**
     * 项目配置路径
     */
    projectPathSelect: SelectSetting = new SelectSetting();
    /**
     * ai config 配置文件
     */
    aiCfgPathSelect: SelectSetting = new SelectSetting();
    /**
     * ai config.json 文件路径
     */
    aiJsonCfgPathSelect: SelectSetting = new SelectSetting();
    /**
     * redis 地址
     */
    redisSelect: SelectSetting = new SelectSetting();
    /**
     *  proto 文件路径
     */
    protoFilePath: SelectSetting = new SelectSetting();
    /**
     * 登录服地址
     */
    loginUrl: SelectSetting = new SelectSetting();
    /**
     * 登录脚本文件路径
     */
    loginScriptFilePath: SelectSetting = new SelectSetting();
    /**
     *
     * @param data
     */
    public static valueOf(data: any) :DToolsSetting {
        let setting = new DToolsSetting();
        setting.protoFilePath = SelectSetting.valueOf(data.protoFilePath, 'http://git.xf.io/config/meta_server/raw/master/proto/AllInOneProtobufProtocol.proto');
        setting.aiJsonCfgPathSelect = SelectSetting.valueOf(data.aiJsonCfgPathSelect, 'http://git.xf.io/config/meta_server/raw/master/ai/AiConfig.json');
        setting.loginUrl = SelectSetting.valueOf(data.loginUrl, 'http://localhost:8080/login');
        setting.redisSelect = SelectSetting.valueOf(data.redisSelect, 'localhost:6379');
        setting.projectPathSelect = SelectSetting.valueOf(data.projectPathSelect);
        setting.aiCfgPathSelect = SelectSetting.valueOf(data.aiCfgPathSelect);
        setting.cfgPathSelect = SelectSetting.valueOf(data.cfgPathSelect);
        setting.loginScriptFilePath = SelectSetting.valueOf(data.loginScriptFilePath);
        setting.role = data.role;
        return setting;
    }
}


