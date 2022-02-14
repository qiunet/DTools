import {Role} from "./Enums";
import {SettingManager} from "../../../preload/utils/SettingManager";
import {CommonUtil} from "./CommonUtil";
export class SelectSetting {
    /**
     * 当前选定数据
     */
    current: string = "";
    /**
     * 列表数据
     */
    list: Array<string> = [];

    static valueOf(data: any) {
        let setting = new SelectSetting();
        if (! CommonUtil.isNullOrUndefined(data.current)) {
            setting.current = data.current;
        }
        if (! CommonUtil.isNullOrUndefined(data.list)) {
            setting.list = data.list;
        }
        return setting;
    }

    /**
     * 使用该路径
     * @param path
     * @return 是否是新增
     */
    public usePath(path: string): boolean {
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
     * 删除某个path
     * @param path
     */
    public removePath(path: string): string {
        const currPath: string = this.current;
        this.list.forEach((val, index, arr) => {
            if (val !== path) {
                return;
            }
            arr.splice(index, 1);
            if (currPath === path && arr.length >= 1) {
                this.current = arr[0];
            }else {
                this.current = "";
            }
        });
        SettingManager.save();
        return this.current;
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
     *
     * @param data
     */
    public static valueOf(data: any) :DToolsSetting {
        let setting = new DToolsSetting();

        setting.projectPathSelect = SelectSetting.valueOf(data.projectPathSelect);
        setting.cfgPathSelect = SelectSetting.valueOf(data.cfgPathSelect);
        if (! CommonUtil.isNullOrUndefined(data.aiCfgPathSelect)) {
            setting.aiCfgPathSelect = SelectSetting.valueOf(data.aiCfgPathSelect);
        }
        setting.role = data.role;
        return setting;
    }
}


