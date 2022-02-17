import {Conditions} from "./Condition";
import {IAIConfig} from "./AiConfig";
export abstract class BHTNode {
    protected static ROOT_ICON = "<svg class=\"icon\" width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M882.688 479.808l-84.16-84.096v-2.88h-2.816L544 141.312a45.44 45.44 0 0 0-64.192 0l-338.56 338.56a45.44 45.44 0 0 0 32.064 77.44h64.448v273.28c0 21.248 17.28 38.528 38.592 38.528h191.104v-71.744h-0.064v-160H556.16v112.576h0.128v119.168h190.784c21.312 0 38.592-17.28 38.592-38.592v-273.28h64.896a45.44 45.44 0 0 0 32.064-77.44z\" p-id=\"12794\" fill=\"#2c2c2c\"></path></svg>";
    public static RANDOM_ICON = "<svg class=\"icon\"  width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M960 698L757.1 562.7v84.5h-145l-88.8-108.6-65.5 80.1 91 111.3c9.6 11.8 24 18.6 39.2 18.6h169v84.6L960 698zM283.8 275.3H114.7C86.7 275.3 64 298 64 326c0 28 22.7 50.7 50.7 50.7h145l88.8 108.5 65.5-80.1-91-111.3c-9.6-11.6-24-18.5-39.2-18.5\" p-id=\"21693\"></path><path d=\"M960 326L757.1 190.8v84.5h-169c-15.3 0-29.6 6.8-39.2 18.6L259.7 647.2h-145c-28 0-50.7 22.7-50.7 50.7 0 28 22.7 50.7 50.7 50.7h169.1c15.2 0 29.6-6.8 39.3-18.6l289-353.3h145v84.6L960 326z\" p-id=\"21694\"></path></svg>";
    public static SEQUENCE_ICON = "<svg class=\"icon\" width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M400 736a48 48 0 1 1 0 96h-288a48 48 0 1 1 0-96h288z m128-256a48 48 0 0 1 0 96h-416a48 48 0 0 1 0-96h416z m0-256a48 48 0 0 1 0 96h-416a48 48 0 0 1 0-96h416zM746.88 149.184c23.488 0 42.624 22.208 42.624 49.536l-0.064 572.544 97.728-97.664a42.88 42.88 0 1 1 60.608 60.608l-170.688 170.624a42.88 42.88 0 0 1-72.896-34.496V198.72c0-27.328 19.072-49.536 42.624-49.536z\" p-id=\"17803\" fill=\"#2c2c2c\"></path></svg>";
    public static SELECTOR_ICON = "<svg class=\"icon\" width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M597.333333 469.802667h213.333334a85.333333 85.333333 0 0 0 85.333333-85.333334v-213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333h-213.333334a85.333333 85.333333 0 0 0-85.333333 85.333333v213.333333a85.333333 85.333333 0 0 0 85.333333 85.333334z m0-256a42.666667 42.666667 0 0 1 42.666667-42.666667h128a42.666667 42.666667 0 0 1 42.666667 42.666667v128a42.666667 42.666667 0 0 1-42.666667 42.666666h-128a42.666667 42.666667 0 0 1-42.666667-42.666666v-128z m328.789334 739.114666l-72.064-72.064A234.666667 234.666667 0 1 0 426.666667 747.093333c0 7.168 0.426667 14.208 1.066666 21.248l85.632-7.808c-0.426667-4.48-1.365333-8.832-1.365333-13.44a149.333333 149.333333 0 1 1 149.333333 149.333334 148.48 148.48 0 0 1-61.696-13.653334l-35.370666 77.824a233.386667 233.386667 0 0 0 230.826666-20.821333l72.064 72.064a41.728 41.728 0 0 0 58.965334-58.922667zM298.666667 85.76H85.333333a85.333333 85.333333 0 0 0-85.333333 85.333333v213.333334a85.333333 85.333333 0 0 0 85.333333 85.333333h213.333334a85.333333 85.333333 0 0 0 85.333333-85.333333v-213.333334a85.333333 85.333333 0 0 0-85.333333-85.333333z m0 256a42.666667 42.666667 0 0 1-42.666667 42.666667H128a42.666667 42.666667 0 0 1-42.666667-42.666667v-128a42.666667 42.666667 0 0 1 42.666667-42.666667h128a42.666667 42.666667 0 0 1 42.666667 42.666667v128z m0 256.042667H85.333333a85.333333 85.333333 0 0 0-85.333333 85.333333v213.333333a85.333333 85.333333 0 0 0 85.333333 85.333334h213.333334a85.333333 85.333333 0 0 0 85.333333-85.333334v-213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333z m0 256a42.666667 42.666667 0 0 1-42.666667 42.666666H128a42.666667 42.666667 0 0 1-42.666667-42.666666v-128a42.666667 42.666667 0 0 1 42.666667-42.666667h128a42.666667 42.666667 0 0 1 42.666667 42.666667v128z m187.562666-29.696a42.666667 42.666667 0 1 0 42.709334 73.898666 42.666667 42.666667 0 0 0-42.709334-73.898666z\" p-id=\"16115\" fill=\"#2c2c2c\"></path></svg> ";
    public static PARALLEL_ICON = "<svg class=\"icon\" width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M256 256a42.666667 42.666667 0 0 1 5.802667 84.935111L256 341.333333H113.777778a42.666667 42.666667 0 0 1-5.802667-84.935111L113.777778 256h142.222222zM938.666667 256a42.666667 42.666667 0 0 1 5.802666 84.935111L938.666667 341.333333H568.888889a42.666667 42.666667 0 0 1-5.802667-84.935111L568.888889 256h369.777778zM540.444444 711.111111a42.666667 42.666667 0 0 1 5.802667 84.935111L540.444444 796.444444H113.777778a42.666667 42.666667 0 0 1-5.802667-84.935111L113.777778 711.111111h426.666666zM938.666667 711.111111a42.666667 42.666667 0 0 1 5.802666 84.935111L938.666667 796.444444H853.333333a42.666667 42.666667 0 0 1-5.802666-84.935111L853.333333 711.111111h85.333334z\" fill=\"#2c2c2c\" p-id=\"15303\"></path><path d=\"M412.444444 128a170.666667 170.666667 0 1 0 0 341.333333 170.666667 170.666667 0 0 0 0-341.333333z m0 85.333333a85.333333 85.333333 0 1 1 0 170.666667 85.333333 85.333333 0 0 1 0-170.666667zM696.888889 583.111111a170.666667 170.666667 0 1 0 0 341.333333 170.666667 170.666667 0 0 0 0-341.333333z m0 85.333333a85.333333 85.333333 0 1 1 0 170.666667 85.333333 85.333333 0 0 1 0-170.666667z\" fill=\"#2c2c2c\" p-id=\"15304\"></path></svg>";
    public static ACTION_ICON = "<svg class=\"icon\" width=\"1em\" height=\"1em\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M213.333333 640v213.333333a42.666667 42.666667 0 0 1-85.333333 0V170.666667a42.666667 42.666667 0 0 1 85.034667-4.992L213.333333 170.666667h341.333334a85.333333 85.333333 0 0 1 85.12 78.933333L640 256h170.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v341.333334a85.333333 85.333333 0 0 1-85.333333 85.333333h-341.333334a85.333333 85.333333 0 0 1-85.333333-85.333333v-42.666667H213.333333z m341.333334-384H213.333333v298.666667h341.333334V256z m85.333333 298.666667a85.333333 85.333333 0 0 1-85.333333 85.333333h-85.333334v42.666667h341.333334V341.333333h-170.666667v213.333334z\" p-id=\"5017\" fill=\"#2c2c2c\"></path></svg>";
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
    name: string = "";
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
            this.name = attrs.name;
        }

        if (attrs.condition !== undefined && attrs.condition !== "") {
            this.buildConditions(attrs.condition);
        }
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
        return this.name;
    }

    public addChild(child: BHTNode): void {
        this.children.push(child);
    }

    protected toXmlObject(): any {
        let arr = [];
        for (let child of this.children) {
            arr.push(child.toXmlObject())
        }
        let obj:any = {":@": this.toXmlParamObject()};
        obj[this.nodeName] = arr;
        return obj;
    }

    protected toXmlParamObject(): any {
        let obj:any = {};
        if (this.nodeName !== "action" && undefined !== this.name) {
            obj.name = this.name;
        }
        if (this.nodeName !== 'root') {
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


export class BehaviorAction extends BHTNode {

    private readonly clazz: string;

    readonly name:string;

    constructor(attrs: any) {
        super("action", attrs);
        this.clazz = attrs.clazz;
       ;
        if (window.tool_api === undefined) {
            this.name = 'unknown';
            return;
        }

        const aiConfig: IAIConfig = window.tool_api.aiConfigJson();
        let find = aiConfig.actionDocs.find((value) => {
            return value.name === this.clazz;
        });
        if (find !== undefined) {
            this.name = find.desc;
        }else {
            this.name = 'unknown';
        }
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
        return obj;
    }
}
//
// const filePath = "/Users/qiunet/work/IdeaProjects/DuoDuo/FlashHandler/src/test/resources/ai.xml";
// let xmlObj = XmlUtil.readXmlFile(filePath);
// let rootExecutor = RootExecutor.parse(xmlObj);
// let xmlObject = rootExecutor.toXmlObject();
// console.log(XmlUtil.buildXmlContent(xmlObject))
