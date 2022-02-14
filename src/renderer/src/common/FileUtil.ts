import * as fs from "fs";
import * as Path from "path";
import {IFileNode} from "./IFileNode";
import {CommonUtil} from "./CommonUtil";

/**
 * 文件工具集合
 */
export class FileUtil {
    /**
     * 复制文件到对应的目录
     * @param srcFilePath
     * @param distFilePath
     */
    public static async copy(srcFilePath: string, distFilePath: string) {
        if (! fs.existsSync(Path.dirname(distFilePath))) {
            fs.mkdirSync(Path.dirname(distFilePath), { recursive: true });
        }
        fs.copyFileSync(srcFilePath, distFilePath);
    }

    /**
     * 读取文件. 得到字符串内容
     * @param filePath
     */
    public static readFile(filePath: string) : string{
        return fs.readFileSync(filePath, "utf-8");
    }

    /**
     * 将内容写入文件
     * @param filePath
     * @param content
     */
    public static writeFile(filePath: string, content: string): void {
        if (!fs.existsSync(Path.dirname(filePath))) {
            fs.mkdirSync(Path.dirname(filePath), { recursive: true });
        }
        fs.writeFile(filePath, content, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    /**
     * 删除文件
     * 外面需要同步处理 使用Promise搞定
     * @param filePath
     */
    public static delFile(filePath: string) : Promise<string> {
        return new Promise((resolve, reject) => {
            fs.rm(filePath, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(filePath);
            });
        });
    }

    /**
     * 列出文件夹类容
     * @param dirPath
     * @param filter
     * @param nameGetter name 获取
     */
    public static listDir(dirPath: string, filter: (file:string) => boolean, nameGetter = (filePath: string) => Path.basename(filePath)) : FileNode {
        let obj = new FileNode(dirPath, true);
        let files = fs.readdirSync(dirPath, "utf-8");
        for (let file0 of files) {
            let file: string = Path.join(dirPath, file0);
            let stats = fs.statSync(file);
            if (stats.isFile()) {
                if (filter(file)) {
                    obj.addChild(new FileNode(file, false, nameGetter(file)));
                }
            }else if (stats.isDirectory()) {
                if (file0.startsWith(".")) {
                    continue;
                }
                obj.addChild(this.listDir(file, filter, nameGetter));
            }
        }
        return obj;
    }

}

export class FileNode implements IFileNode {
    fullPath: string;
    dir: boolean;
    name: string;
    children: Array<IFileNode>;

    constructor(fullPath: string, dir: boolean, name ?:string) {
        this.dir = dir;
        this.children = [];
        this.fullPath = fullPath;
        if (name === undefined) {
            this.name = Path.basename(fullPath);
        }else {
            this.name = name;
        }
    }

    public addChild(node: IFileNode) {
        if (! this.children) {
            this.children = [];
        }
        this.children.push(node);
    }

    isDir(): boolean {
        return this.dir;
    }

    isFile(): boolean {
        return !this.isDir();
    }
}
