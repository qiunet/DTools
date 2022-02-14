import {X2jOptionsOptional, XMLBuilder, XmlBuilderOptionsOptional, XMLParser} from "fast-xml-parser";
import {FileUtil} from "../../renderer/src/common/FileUtil";
import fs from "fs";


export class XmlUtil {
     private static readonly readOptions: X2jOptionsOptional = {
        allowBooleanAttributes : false,
         parseAttributeValue : false,
         ignoreAttributes : false,
         attributeNamePrefix : "",
         ignoreDeclaration: true,
         preserveOrder: true,
         trimValues: true,
    };

     private static readonly writeOptions: XmlBuilderOptionsOptional = {
         attributeNamePrefix: "",
         ignoreAttributes: false,
         suppressEmptyNode: true,
         processEntities: false,
         preserveOrder: true,
         format: true
     }


    public static readXmlFile(filePath: string): any {
         const data = fs.readFileSync(filePath, "utf-8");
         const parse = new XMLParser(this.readOptions);
        return parse.parse(data);
    }

    /**
     * 将xml Obj 转成 xml 内容
     * @param xmlObj
     */
    public static buildXmlContent(xmlObj: any): string {
         let builder = new XMLBuilder(this.writeOptions);
         let content = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
         content += builder.build(xmlObj);
         return content;
    }

    /**
     * 将xml obj 写入对应路径
     * @param xmlObj
     * @param filePath
     */
    public static writeXmlFile(xmlObj: any, filePath: string): void {
        FileUtil.writeFile(filePath, this.buildXmlContent(xmlObj));
    }
}
