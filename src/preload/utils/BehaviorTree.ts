import {Conditions} from "./Condition";
import {IAIConfig} from "./AiConfig";
export abstract class BHTNode {
    protected static ROOT_ICON = "<svg class=\"icon\" width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M882.688 479.808l-84.16-84.096v-2.88h-2.816L544 141.312a45.44 45.44 0 0 0-64.192 0l-338.56 338.56a45.44 45.44 0 0 0 32.064 77.44h64.448v273.28c0 21.248 17.28 38.528 38.592 38.528h191.104v-71.744h-0.064v-160H556.16v112.576h0.128v119.168h190.784c21.312 0 38.592-17.28 38.592-38.592v-273.28h64.896a45.44 45.44 0 0 0 32.064-77.44z\" p-id=\"12794\" fill=\"#2c2c2c\"></path></svg>";
    public static RANDOM_ICON = "<svg class=\"icon\"  width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M960 698L757.1 562.7v84.5h-145l-88.8-108.6-65.5 80.1 91 111.3c9.6 11.8 24 18.6 39.2 18.6h169v84.6L960 698zM283.8 275.3H114.7C86.7 275.3 64 298 64 326c0 28 22.7 50.7 50.7 50.7h145l88.8 108.5 65.5-80.1-91-111.3c-9.6-11.6-24-18.5-39.2-18.5\" p-id=\"21693\"></path><path d=\"M960 326L757.1 190.8v84.5h-169c-15.3 0-29.6 6.8-39.2 18.6L259.7 647.2h-145c-28 0-50.7 22.7-50.7 50.7 0 28 22.7 50.7 50.7 50.7h169.1c15.2 0 29.6-6.8 39.3-18.6l289-353.3h145v84.6L960 326z\" p-id=\"21694\"></path></svg>";
    public static SEQUENCE_ICON = "<svg class=\"icon\" width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M400 736a48 48 0 1 1 0 96h-288a48 48 0 1 1 0-96h288z m128-256a48 48 0 0 1 0 96h-416a48 48 0 0 1 0-96h416z m0-256a48 48 0 0 1 0 96h-416a48 48 0 0 1 0-96h416zM746.88 149.184c23.488 0 42.624 22.208 42.624 49.536l-0.064 572.544 97.728-97.664a42.88 42.88 0 1 1 60.608 60.608l-170.688 170.624a42.88 42.88 0 0 1-72.896-34.496V198.72c0-27.328 19.072-49.536 42.624-49.536z\" p-id=\"17803\" fill=\"#2c2c2c\"></path></svg>";
    public static SELECTOR_ICON = "<svg class=\"icon\" width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M597.333333 469.802667h213.333334a85.333333 85.333333 0 0 0 85.333333-85.333334v-213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333h-213.333334a85.333333 85.333333 0 0 0-85.333333 85.333333v213.333333a85.333333 85.333333 0 0 0 85.333333 85.333334z m0-256a42.666667 42.666667 0 0 1 42.666667-42.666667h128a42.666667 42.666667 0 0 1 42.666667 42.666667v128a42.666667 42.666667 0 0 1-42.666667 42.666666h-128a42.666667 42.666667 0 0 1-42.666667-42.666666v-128z m328.789334 739.114666l-72.064-72.064A234.666667 234.666667 0 1 0 426.666667 747.093333c0 7.168 0.426667 14.208 1.066666 21.248l85.632-7.808c-0.426667-4.48-1.365333-8.832-1.365333-13.44a149.333333 149.333333 0 1 1 149.333333 149.333334 148.48 148.48 0 0 1-61.696-13.653334l-35.370666 77.824a233.386667 233.386667 0 0 0 230.826666-20.821333l72.064 72.064a41.728 41.728 0 0 0 58.965334-58.922667zM298.666667 85.76H85.333333a85.333333 85.333333 0 0 0-85.333333 85.333333v213.333334a85.333333 85.333333 0 0 0 85.333333 85.333333h213.333334a85.333333 85.333333 0 0 0 85.333333-85.333333v-213.333334a85.333333 85.333333 0 0 0-85.333333-85.333333z m0 256a42.666667 42.666667 0 0 1-42.666667 42.666667H128a42.666667 42.666667 0 0 1-42.666667-42.666667v-128a42.666667 42.666667 0 0 1 42.666667-42.666667h128a42.666667 42.666667 0 0 1 42.666667 42.666667v128z m0 256.042667H85.333333a85.333333 85.333333 0 0 0-85.333333 85.333333v213.333333a85.333333 85.333333 0 0 0 85.333333 85.333334h213.333334a85.333333 85.333333 0 0 0 85.333333-85.333334v-213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333z m0 256a42.666667 42.666667 0 0 1-42.666667 42.666666H128a42.666667 42.666667 0 0 1-42.666667-42.666666v-128a42.666667 42.666667 0 0 1 42.666667-42.666667h128a42.666667 42.666667 0 0 1 42.666667 42.666667v128z m187.562666-29.696a42.666667 42.666667 0 1 0 42.709334 73.898666 42.666667 42.666667 0 0 0-42.709334-73.898666z\" p-id=\"16115\" fill=\"#2c2c2c\"></path></svg> ";
    public static PARALLEL_ICON = "<svg class=\"icon\" width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M256 256a42.666667 42.666667 0 0 1 5.802667 84.935111L256 341.333333H113.777778a42.666667 42.666667 0 0 1-5.802667-84.935111L113.777778 256h142.222222zM938.666667 256a42.666667 42.666667 0 0 1 5.802666 84.935111L938.666667 341.333333H568.888889a42.666667 42.666667 0 0 1-5.802667-84.935111L568.888889 256h369.777778zM540.444444 711.111111a42.666667 42.666667 0 0 1 5.802667 84.935111L540.444444 796.444444H113.777778a42.666667 42.666667 0 0 1-5.802667-84.935111L113.777778 711.111111h426.666666zM938.666667 711.111111a42.666667 42.666667 0 0 1 5.802666 84.935111L938.666667 796.444444H853.333333a42.666667 42.666667 0 0 1-5.802666-84.935111L853.333333 711.111111h85.333334z\" fill=\"#2c2c2c\" p-id=\"15303\"></path><path d=\"M412.444444 128a170.666667 170.666667 0 1 0 0 341.333333 170.666667 170.666667 0 0 0 0-341.333333z m0 85.333333a85.333333 85.333333 0 1 1 0 170.666667 85.333333 85.333333 0 0 1 0-170.666667zM696.888889 583.111111a170.666667 170.666667 0 1 0 0 341.333333 170.666667 170.666667 0 0 0 0-341.333333z m0 85.333333a85.333333 85.333333 0 1 1 0 170.666667 85.333333 85.333333 0 0 1 0-170.666667z\" fill=\"#2c2c2c\" p-id=\"15304\"></path></svg>";
    public static ACTION_ICON = "<svg class=\"icon\" width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M213.333333 640v213.333333a42.666667 42.666667 0 0 1-85.333333 0V170.666667a42.666667 42.666667 0 0 1 85.034667-4.992L213.333333 170.666667h341.333334a85.333333 85.333333 0 0 1 85.12 78.933333L640 256h170.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v341.333334a85.333333 85.333333 0 0 1-85.333333 85.333333h-341.333334a85.333333 85.333333 0 0 1-85.333333-85.333333v-42.666667H213.333333z m341.333334-384H213.333333v298.666667h341.333334V256z m85.333333 298.666667a85.333333 85.333333 0 0 1-85.333333 85.333333h-85.333334v42.666667h341.333334V341.333333h-170.666667v213.333334z\" p-id=\"5017\" fill=\"#2c2c2c\"></path></svg>";
    public static INVERT_ICON = "<svg class=\"icon\" width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M329.142857 365.714286m36.571429 0l548.571428 0q36.571429 0 36.571429 36.571428l0 329.142857q0 36.571429-36.571429 36.571429l-548.571428 0q-36.571429 0-36.571429-36.571429l0-329.142857q0-36.571429 36.571429-36.571428Z\" fill=\"#2c2c2c\" p-id=\"9793\"></path><path d=\"M834.706286 438.857143c23.771429 0 43.008 20.845714 43.008 46.555428v418.889143C877.714286 930.011429 858.441143 950.857143 834.706286 950.857143H189.293714C165.522286 950.857143 146.285714 930.011429 146.285714 904.301714V485.412571C146.285714 459.702857 165.558857 438.857143 189.293714 438.857143h645.412572zM804.571429 512H219.428571v365.714286h585.142858V512zM477.476571 73.142857c139.849143-0.109714 271.433143 58.587429 354.486858 158.134857a35.364571 35.364571 0 0 1 5.632 39.131429c-6.253714 12.982857-19.968 21.942857-35.84 23.478857-15.835429 1.499429-31.378286-4.681143-40.594286-16.164571-66.486857-79.689143-171.776-126.646857-283.684572-126.537143-111.104 0-213.577143 45.714286-282.843428 125.184l-12.068572 11.300571h96.512c23.296 0.036571 42.569143 16.128 43.958858 36.754286 1.353143 20.589714-15.652571 38.582857-38.802286 41.033143L279.04 365.714286H80.164571l-2.633142-0.109715 3.145142 0.109715a48.64 48.64 0 0 1-25.161142-6.948572 43.52 43.52 0 0 1-5.046858-3.657143l3.693715 2.779429a43.593143 43.593143 0 0 1-3.291429-2.450286L50.468571 355.145143a40.557714 40.557714 0 0 1-9.398857-11.337143 36.278857 36.278857 0 0 1-4.205714-12.544l-0.073143-0.768a34.779429 34.779429 0 0 1-0.146286-1.645714L36.571429 326.692571v-175.542857c0-20.626286 18.212571-37.668571 41.508571-38.875428 23.296-1.206857 43.593143 13.824 46.372571 34.340571l0.292572 4.534857V228.571429l2.779428-2.633143C207.835429 133.12 331.044571 77.056 463.140571 73.398857L477.476571 73.142857z\" fill=\"#2c2c2c\" p-id=\"9794\"></path></svg>";
    public static REPEAT_ICON = "<svg class=\"icon\"  width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M853.333333 707.669333l55.168-55.168a42.666667 42.666667 0 0 1 60.330667 60.330667l-128 128a42.666667 42.666667 0 0 1-60.330667 0l-128-128a42.666667 42.666667 0 0 1 60.330667-60.330667L768 707.669333V256h-341.333333a42.666667 42.666667 0 1 1 0-85.333333h384a42.666667 42.666667 0 0 1 42.666666 42.666666v494.336zM170.666667 316.330667L115.498667 371.498667a42.666667 42.666667 0 0 1-60.330667-60.330667l128-128a42.666667 42.666667 0 0 1 60.330667 0l128 128a42.666667 42.666667 0 0 1-60.330667 60.330667L256 316.330667V768h341.333333a42.666667 42.666667 0 0 1 0 85.333333H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666666V316.330667z\" p-id=\"2017\" fill=\"#2c2c2c\"></path></svg>";
    public static COUNTER_ICON = "<svg class=\"icon\" width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M853.333333 896H170.666667c-46.933333 0-85.333333-38.4-85.333334-85.333333V213.333333c0-46.933333 38.4-85.333333 85.333334-85.333333h682.666666c46.933333 0 85.333333 38.4 85.333334 85.333333v597.333334c0 46.933333-38.4 85.333333-85.333334 85.333333z m-149.333333-260.266667c29.866667-4.266667 59.733333 8.533333 85.333333 29.866667 12.8 17.066667 21.333333 34.133333 21.333334 55.466667 0 29.866667-17.066667 59.733333-46.933334 72.533333l21.333334 17.066667H853.333333V213.333333h-51.2c4.266667 12.8 8.533333 29.866667 8.533334 46.933334-4.266667 25.6-12.8 46.933333-29.866667 68.266666L682.666667 439.466667h140.8v51.2h-221.866667v-42.666667s128-136.533333 136.533333-149.333333c8.533333-21.333333 12.8-46.933333 4.266667-68.266667-12.8-12.8-25.6-17.066667-38.4-17.066667-12.8 0-25.6 4.266667-34.133333 17.066667-8.533333 12.8-12.8 25.6-12.8 38.4h-64c0-21.333333 8.533333-38.4 17.066666-55.466667H554.666667v597.333334h110.933333v-38.4h42.666667c21.333333-4.266667 38.4-21.333333 38.4-42.666667 0-12.8-4.266667-21.333333-8.533334-29.866667-8.533333-8.533333-21.333333-12.8-29.866666-12.8 0 0-46.933333 0-46.933334 38.4H597.333333c0-17.066667 4.266667-29.866667 12.8-42.666666 21.333333-34.133333 55.466667-51.2 93.866667-46.933334z m-388.266667-200.533333V682.666667h64V358.4h-4.266666L238.933333 405.333333v51.2l76.8-21.333333z\" p-id=\"2214\" fill=\"#2c2c2c\"></path></svg>"
    /**
     * 一个分配ID的
     * @private
     */
    private static idCounter: number = 0;

    readonly id: number;
    /**
     * name
     * @private
     */
    protected _name: string = "";
    /**
     * 子类
     * @private
     */
    children: Array<BHTNode> = [];

    readonly nodeName: string;
    /**
     * 条件 数组之间是或的关系
     * Conditions 里面是与的关系
     * @private
     */
    readonly conditions: Array<Conditions> = [];

    protected constructor(nodeName: string, attrs: any) {
        this.id = BHTNode.idCounter++;

        this.nodeName = nodeName;

        if (attrs === undefined) {
            return;
        }

        if (attrs.name !== undefined) {
            this._name = attrs.name;
        }

        if (attrs.condition !== undefined && attrs.condition !== "") {
            this.buildConditions(attrs.condition);
        }
    }

    public get name() {
        return this._name;
    }

    private buildConditions(data: string) {
        let strArray = data.split("||");
        for (let str of strArray) {
            str = str.replaceAll("'", "\"");
            this.conditions.push(new Conditions(str))
        }
    }
    /**
     * 或一个conditions
     * @param conditions
     */
    public orAConditions(conditions: Conditions): void {
        this.conditions.push(conditions);
    }

    public get canAddChild(): boolean{
        return this.nodeName !== 'action';
    }

    /**
     * 删除组
     * @param conditions
     */
    public delConditions(conditions: Conditions): void {
        const index = this.conditions.findIndex(value => value === conditions)
        if (index !== -1) {
            this.conditions.splice(index, 1)
        }
    }

    public getName(): string {
        return this._name;
    }

    public addChild(child: BHTNode): void {
        this.children.push(child);
    }

    /**
     * 是否需要添加到xml 父类组件
     * @protected
     */
    protected addToXmlParent(): boolean {
        return true;
    }

    protected toXmlObject(): any {
        let arr = [];
        for (let child of this.children) {
            if (! child.addToXmlParent()) {
                continue;
            }

            arr.push(child.toXmlObject())
        }
        let obj:any = {":@": this.toXmlParamObject()};
        obj[this.nodeName] = arr;
        return obj;
    }

    protected toXmlParamObject(): any {
        let obj:any = {};
        if (this.nodeName !== "action" && undefined !== this._name) {
            obj.name = this._name;
        }
        if (this.nodeName !== 'root' && ! (this instanceof DecoratorNode)) {
            let condition = '';
            for (let i = 0; i < this.conditions.length; i++) {
                condition += this.conditions[i].toString()
                if (i < this.conditions.length - 1) {
                    condition += "||";
                }
            }
            obj.condition = condition;
        }
        return obj;
    }

    public abstract icon(): string;
}

export class RootExecutor extends BHTNode {
    constructor(attrs: any) {
        super("root", attrs);
    }

    public icon(): string {
        return BHTNode.ROOT_ICON;
    }

    protected toXmlParamObject(): any {
        let obj = super.toXmlParamObject();
        obj["xmlns:xsi"] = "http://www.w3.org/2001/XMLSchema-instance",
            obj["xsi:noNamespaceSchemaLocation"] = "https://raw.githubusercontent.com/qiunet/DuoDuo/master/FlashHandler/src/main/resources/AiBuild.xsd"
        return obj;
    }

    /**
     * 转换成xml obj
     */
    public toXmlObject(): any {
        return [super.toXmlObject()];
    }
    /**
     * 解析xml对象.
     * @param xmlObj
     */
    public static parse(xmlObj: any): RootExecutor {
        return (<RootExecutor>this.parseData(xmlObj[0]));
    }

    private static parseData(data: any): BHTNode {
        let attrs =  data[":@"];
        let node: BHTNode;
        let childData: any[];
        if ((childData = data.sequence) !== undefined) {
            node = new SequenceExecutor(attrs);
        } else if ((childData = data.root) !== undefined) {
            node = new RootExecutor(attrs);
        } else if ((childData = data.random) !== undefined) {
            node = new RandomExecutor(attrs);
        }else if ((childData = data.selector) !== undefined) {
            node = new SelectorExecutor(attrs);
        }else if ((childData = data.parallel) !== undefined) {
            node = new ParallelExecutor(attrs);
        }else if ((childData = data.repeat) !== undefined) {
            node = new RepeatNode(attrs);
        }else if ((childData = data.counter) !== undefined) {
            node = new CounterNode(attrs);
        } else if ((childData = data.invert) !== undefined) {
            node = new InvertNode(attrs);
        }else if( data.action !== undefined) {
            node = new BehaviorAction(attrs);
        }else {
            throw new Error("Not supported: "+  data);
        }
        if (childData !== undefined) {
            for (let data0 of childData) {
                node.addChild(this.parseData(data0));
            }
        }
        return node;
    }
}

export class SequenceExecutor extends BHTNode {

    constructor(attrs: any) {
        super("sequence", attrs);
    }

    public icon(): string {
        return BHTNode.SEQUENCE_ICON;
    }
}

export class SelectorExecutor extends BHTNode {

    constructor(attrs: any) {
        super("selector", attrs);
    }

    public icon(): string {
        return BHTNode.SELECTOR_ICON;
    }
}

export class RandomExecutor extends BHTNode {

    constructor(attrs: any) {
        super("random", attrs);
    }

    public icon(): string {
        return BHTNode.RANDOM_ICON;
    }
}

export class ParallelExecutor extends BHTNode {

    constructor(attrs: any) {
        super("parallel", attrs);
    }

    public icon(): string {
        return BHTNode.PARALLEL_ICON;
    }
}

abstract class DecoratorNode extends BHTNode {
    /**
     * 装饰节点
     */
    readonly decorator: boolean = true;

    protected constructor(nodeName: string, attrs: any){
        super(nodeName, attrs)
    }

    public get canAddChild(): boolean{
        return super.canAddChild && this.children.length == 0;
    }

    protected addToXmlParent(): boolean {
        return this.children.length === 1;
    }

    addChild(child: BHTNode) {
        if (this.children.length >= 1) {
            throw new Error("Decorator node has more than one child!");
        }
        super.addChild(child);
    }
}

export class InvertNode extends DecoratorNode {

    constructor(attrs: any) {
        super("invert", attrs);
    }

    public icon(): string {
        return BHTNode.INVERT_ICON;
    }

    public get name() {
        return "反转结果装饰节点";
    }
}

export class RepeatNode extends DecoratorNode {
    count: number;
    constructor(attrs: any) {
        super("repeat", attrs);

        this.count = attrs.count;
    }

    public icon(): string {
        return BHTNode.REPEAT_ICON;
    }

    public get name() {
        return "重复"+this.count+"次装饰节点";
    }

    protected toXmlParamObject(): any {
        const obj = super.toXmlParamObject();
        obj.count = this.count;
        return obj;
    }
}

export class CounterNode extends DecoratorNode {
    count: number;
    constructor(attrs: any) {
        super("counter", attrs);

        this.count = attrs.count;
    }

    public icon(): string {
        return BHTNode.COUNTER_ICON;
    }

    public get name() {
        return "计数"+this.count+"次装饰节点";
    }

    protected toXmlParamObject(): any {
        const obj = super.toXmlParamObject();
        obj.count = this.count;
        return obj;
    }
}


export class BehaviorAction extends BHTNode {

    readonly clazz: string;

    readonly params: Record<string, string>;

    constructor(attrs: any) {
        super("action", attrs);
        this.clazz = attrs.clazz;
        if (typeof attrs.params === "string") {
            this.params = JSON.parse(attrs.params.replaceAll("'", "\""));
        }else {
            this.params = attrs.params;
        }
        if (this.params === undefined) {
            this.params = {};
        }
    }

    public getParam(key: string): string {
        return this.params[key];
    }

    public setParam(key: string, value: string){
        this.params[key] = value;
    }

    public get name() {
        if (this._name !== '') {
            return this._name;
        }

        if (window.tool_api === undefined) {
            this._name = 'unknown';
        }

        const aiConfig: IAIConfig = window.tool_api.aiConfigJson();
        let find = aiConfig.actionDocs.find((value) => {
            return value.name === this.clazz;
        });
        if (find !== undefined) {
            this._name = find.desc;
        }else {
            this._name = 'unknown';
        }
        return this._name;
    }

    public icon(): string {
        return BHTNode.ACTION_ICON;
    }

    addChild(child: BHTNode) {
        throw new Error("not supported");
    }

    protected toXmlParamObject(): any {
        let obj = super.toXmlParamObject();
        obj.clazz = this.clazz;
        if (this.params !== undefined) {
            obj.params = JSON.stringify(this.params).replaceAll("\"", "'");
        }
        return obj;
    }
}
//
// const filePath = "/Users/qiunet/work/IdeaProjects/DuoDuo/FlashHandler/src/test/resources/ai.xml";
// let xmlObj = XmlUtil.readXmlFile(filePath);
// let rootExecutor = RootExecutor.parse(xmlObj);
// let xmlObject = rootExecutor.toXmlObject();
// console.log(XmlUtil.buildXmlContent(xmlObject))
