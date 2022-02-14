import {Conditions} from "./Condition";

class BHTNode {
    /**
     * 一个分配ID的
     * @private
     */
    private static idCounter: number = 0;

    private readonly id: number;
    /**
     * name
     * @private
     */
    private name: string = "";
    private readonly nodeName: string;
    /**
     * 子类
     * @private
     */
    private children: BHTNode[] = [];
    /**
     * 条件
     * @private
     */
    private readonly conditions: Conditions | undefined;

    constructor(nodeName: string, attrs: any) {
        this.id = BHTNode.idCounter++;

        RootExecutor.allNodes.set(this.id, this);
        this.nodeName = nodeName;

        if (attrs === undefined) {
            return;
        }

        if (attrs.name !== undefined) {
            this.name = attrs.name;
        }

        if (attrs.condition !== undefined && attrs.condition !== "") {
            this.conditions = new Conditions(attrs.condition);
        }
    }

    public getName(): string {
        return this.name;
    }



    public getConditions(): Conditions|undefined {
        return this.conditions;
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
        if (undefined !== this.conditions) {
            obj.condition = this.conditions.toString();
        }
        return obj;
    }
}

export class RootExecutor extends BHTNode {
    static allNodes: Map<number, BHTNode> = new Map<number, BHTNode>();

    constructor(attrs: any) {
        super("root", attrs);
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
}

export class SelectorExecutor extends BHTNode {

    constructor(attrs: any) {
        super("selector", attrs);
    }
}

export class RandomExecutor extends BHTNode {

    constructor(attrs: any) {
        super("random", attrs);
    }
}

export class ParallelExecutor extends BHTNode {

    constructor(attrs: any) {
        super("parallel", attrs);
    }
}


export class BehaviorAction extends BHTNode {

    private readonly clazz: string;

    constructor(attrs: any) {
        super("action", attrs);
        this.clazz = attrs.clazz;
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
