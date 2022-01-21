import {Role} from "./Enums";

export class DToolsSetting {
    /**
     *  角色
     * @private
     */
    public role: Role = Role.SERVER;
    /**
     * 当前使用的cfgPath
     * @private
     */
    public currCfgPath: string = "";
    /**
     * 当前使用的工程路径
     * @private
     */
    public currProjectPath: string = "";
    /**
     * 所有配置路径
     * @private
     */
    public cfgPaths: Array<string> = [];
    /**
     * 所有的
     * @private
     */
    public projectPaths: Array<string> = [];

    public static valueOf(data: any): DToolsSetting {
        let setting = new DToolsSetting();
        setting.currProjectPath = data.currProjectPath;
        setting.projectPaths = data.projectPaths;
        setting.currCfgPath = data.currCfgPath;
        setting.cfgPaths = data.cfgPaths;
        setting.role = data.role;
        return setting;
    }

    public getRole(): Role {
        return this.role;
    }

    public getCurrCfgPath(): string {
        return this.currCfgPath;
    }

    public getCurrProjectPath(): string {
        return this.currProjectPath;
    }

    public getCfgPaths(): Array<string> {
        return this.cfgPaths;
    }

    public getProjectPaths(): Array<string> {
        return this.projectPaths;
    }


    public setRole(value: Role) {
        this.role = value;
    }

    public setCurrCfgPath(value: string) {
        this.currCfgPath = value;
    }

    public setCurrProjectPath(value: string) {
        this.currProjectPath = value;
    }
}
