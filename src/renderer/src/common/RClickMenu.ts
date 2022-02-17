/**
 * 右键菜单选项.
 * 可以搞定隐藏
 */
export class RClickMenu {
    private readonly _label: string;
    private readonly _tip: string;
    private readonly _click: () => void;
    private readonly _icon: string;
    private readonly hide0: (() => boolean) | undefined;
    private readonly _divided: boolean = false;

    constructor(label: string, tip: string, click: () => void, icon: string = '', hide0?:() => boolean, divided?: boolean) {
        this._label = label;
        this._tip = tip;
        this._icon = icon;
        this.hide0 = hide0;
        this._click = click;
        if (divided !== undefined) {
            this._divided = divided;
        }
    }

    get label() {
        return this._label;
    }

    get tip(): string {
        return this._tip;
    }

    get click(): () => void {
        return this._click;
    }

    get icon(): string {
        return this._icon;
    }

    get hidden(): boolean {
        return this.hide0 !== undefined && this.hide0();
    }

    get divided(): boolean {
        return this._divided;
    }
}
