import {Role} from "./Enums";
import {SettingManager} from "../../../preload/utils/SettingManager";
import {CommonUtil} from "./CommonUtil";
export class SelectSetting {

    defaultVal: string|undefined = undefined;
    /**
     * 当前选定数据
     */
    current: string = '';
    /**
     * 列表数据
     */
    list: Array<string> = [];

    static valueOf(data: any, defaultVal?: string) {
        let setting = new SelectSetting();
        if(data !== undefined) {
            if (! CommonUtil.isNullOrUndefined(data.current)) {
                setting.current = data.current;
            }
            if (! CommonUtil.isNullOrUndefined(data.list)) {
                setting.list = data.list;
            }
        }
        setting.defaultVal = defaultVal;
        if (setting.current === '' && setting.defaultVal !== undefined) {
            setting.current = setting.defaultVal;
        }
        return setting;
    }

    /**
     * 使用该路径
     * @param path
     * @return 是否是新增
     */
    usePath = (path: string): boolean => {
        if (path === this.defaultVal) {
            this.current = path;
            return false;
        }

        if (path.endsWith("/")) {
            path = path.substring(0, path.length - 1);
        }
        let newPath = false;
        if (! this.list.find((str, index, objs) => {
            if (str === path) {
                return true;
            }
        })) {
            this.list.push(path);
            newPath = true;
        }
        this.current = path;
        SettingManager.save();
        return newPath;
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
        const currPath: string = this.current;
        if (this.current === this.defaultVal) {
            // 默认的不能删除
            return this.current;
        }

        this.list.forEach((val, index, arr) => {
            if (val !== path) {
                return;
            }
            arr.splice(index, 1);
            if (currPath === path && arr.length >= 1) {
                this.current = arr[0];
            }else {
                if(this.defaultVal !== undefined) {
                    this.current = this.defaultVal;
                }else {
                    this.current = "";
                }
            }
        });
        SettingManager.save();
        return this.current;
    }

    toJSON() {
        return {
            current: this.current,
            list: this.list
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
     * redis 地址
     */
    redisSelect: SelectSetting = new SelectSetting();
    /**
     *  proto 文件路径
     */
    protoFilePath: SelectSetting = new SelectSetting();
    /**
     *
     * @param data
     */
    public static valueOf(data: any) :DToolsSetting {
        let setting = new DToolsSetting();

        setting.projectPathSelect = SelectSetting.valueOf(data.projectPathSelect);
        setting.cfgPathSelect = SelectSetting.valueOf(data.cfgPathSelect);
        setting.aiCfgPathSelect = SelectSetting.valueOf(data.aiCfgPathSelect);
        setting.redisSelect = SelectSetting.valueOf(data.redisSelect, 'localhost:6379');

        setting.protoFilePath = SelectSetting.valueOf(data.protoFilePath);
        setting.role = data.role;
        return setting;
    }
}


