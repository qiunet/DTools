import * as Path from "path";
import * as Excel from 'exceljs';
import ejs from "ejs";
import os from "os";
import fs from "fs";

/**
 * 跟 common/Enums/Role 同步.
 * ExcelToCfg  是个单独能运行的ts.
 * 通用的枚举自己保存一份.
 */
export enum Role {
    /**
     * 客户端
     */
    CLIENT,
    /**
     * 服务器
     */
    SERVER,
    /**
     * 其它
     */
    OTHER,
}


export class Constants {
    /**
     * 配置目录
     */
    public static readonly SETTING_DIR = ".dTools";
    /**
     * 存放ejs的目录
     */
    public static readonly EJS_TEMPLATE_DIR = "ejs";

    /**
     * 获得ejs 模板路径
     */
    public static ejsTemplateDir(): string {
        return Path.join(os.homedir(), this.SETTING_DIR, this.EJS_TEMPLATE_DIR);
    }
}
/**
 * 列输出类型
 */
enum OutputType {
    /**
     * 忽略该列
     */
    IGNORE,
    /**
     * 仅客户端
     */
    CLIENT,
    /**
     * 仅服务器
     */
    SERVER,
    /**
     * 所有角色
     */
    ALL,

}

/**
 * 所有的excel配置数据
 */
class ExcelCfg {
    /**
     * 配置数据 行数组
     */
    private rows: ExcelRowCfg[] = [];

    /**
     * 添加数据
     * @param rowData
     */
    public addData(rowData: ExcelRowCfg): void{
        this.rows.push(rowData);
    }
}

/**
 * 行数据
 */
class ExcelRowCfg {
    cells: UnitData[] = [];

    /**
     * 添加数据
     * @param data
     * @private
     */
    public addData(data: UnitData): void {
        this.cells.push(data);
    }
}
/**
 * 单元的数据
 */
class UnitData {
    /**
     * 字段名称
     */
    name: string = "";
    /**
     * 类型描述
     * 一般就int long
     * string
     * (int[]  long[]是string 类型, 用;隔开)
     */
    type: string = "string";
    /**
     * 字段值
     */
    val: string|number = '';

    /**
     * string type
     */
    isStringType():boolean {
        return ! this.isNumberType();
    }

    /**
     * number 类型
     */
    isNumberType() {
        return  this.type === 'int' || this.type === 'long';
    }
}

/**
 * 正确字符串表述值
 * @type {Set<string>}
 */
const trueValSet = new Set(["yes", "1", "true"]);
/**
 * excel 转 cfg
 *
 * 输出类型的字符串给模板
 *
 * [
 *   [
 *     UnitData { fieldName: 'id', type: 'int', val: 1 },
 *     UnitData { fieldName: 'val', type: 'long', val: 200 }
 *   ],
 *   [
 *     UnitData { fieldName: 'id', type: 'int', val: 2 },
 *     UnitData { fieldName: 'val', type: 'long', val: 20 }
 *   ]
 * ]
 */
export class ExcelToCfg {
    /**
     * 角色类型
     * @private
     */
    private readonly _role: Role;
    /**
     * 相对于configDir路径
     * @private
     */
    private readonly _fileRelativePath: string;
    /**
     * 配置文件路径
     * @private
     */
    private readonly _configDir: string;
    /**
     * 输出文件夹路径
     *
     * @private
     */
    private readonly _outputDirPaths: string[];
    /**
     * 记录日志
     * @private
     */
    private readonly _logger: (info: string) => void;

    constructor(role: Role, fileRelativePath: string, configDir: string, outputDirPaths:string[], logger?: (info: string) => void) {
        this._fileRelativePath = fileRelativePath;
        this._outputDirPaths = outputDirPaths;
        this._configDir = configDir;
        this._role = role;
        if (logger) {
            this._logger = logger;
        }else {
            this._logger = console.log;
        }
    }

    /**
     * 获得文件名
     */
    getFileName():string {
        return Path.basename(this.fileRelativePath);
    }

    /**
     * 获得配置前缀
     */
    getCfgPrefix():string {
        let name = this.getFileName();
        return name.substring(name.indexOf("_") + 1, name.lastIndexOf("."));
    }


    get logger(): (info: string) => void {
        return this._logger;
    }

    get role(): Role {
        return this._role;
    }

    get fileRelativePath(): string {
        return this._fileRelativePath;
    }

    get configDir(): string {
        return this._configDir;
    }

    get outputDirPaths(): string[] {
        return this._outputDirPaths;
    }

    /**
     * 转换并生成文件
     */
    public convert(): void {
        if (this._outputDirPaths === null || this._outputDirPaths.length === 0) {
            this.logger("项目输出路径为空. 转化终止!\n")
            return
        }

        if (! this._fileRelativePath.endsWith(".xlsx")) {
            this._logger(this._fileRelativePath + "不是xlsx文件");
            throw new Error(this._fileRelativePath + "不是xlsx文件");
        }

        let workbook = new Excel.Workbook();
        workbook.xlsx.readFile(Path.join(this._configDir, this._fileRelativePath)).then(workbook => {
            for (let worksheet of workbook.worksheets) {
                if (worksheet.name === 'end') {
                    break;
                }
                new ExcelSheet(this, worksheet).handlerSheet();
            }
        });
    }

    /**
     * 服务器脚本调用.
     * 转换整个文件夹.
     * @param configPath
     * @param outDirs
     * @param logger
     */
    public static convertDir(configPath: string, outDirs: string[], logger?: (info: string) => void) {
        this.convertDir0(configPath, '/', outDirs);
    }
    private static convertDir0(path: string, relativePath: string, outDirs: string[], logger?: (info: string) => void): void {
        if (! fs.statSync(path).isDirectory()) {
            throw new Error("not a directory!")
        }

        for (const file of fs.readdirSync(path)) {
            let rPath = Path.join(relativePath, file);
            if (fs.statSync(file).isDirectory()) {
                this.convertDir0(path, rPath, outDirs);
                continue;
            }
            let excelToCfg = new ExcelToCfg(Role.SERVER, rPath, path, outDirs, logger)
            excelToCfg.convert();
        }
    }

}

class ExcelSheet {
    /**
     * ExcelToCfg  的配置
     * @private
     */
    private readonly cfgConfig: ExcelToCfg;
    /**
     * 单个sheet
     * @private
     */
    private readonly sheet: Excel.Worksheet;
    /**
     * 日志
     * @private
     */
    private readonly logger: (info: string) => void;
    /**
     * 真实列数
     * @private
     */
    private readonly columnCount: number;
    /**
     * 真实行数
     * @private
     */
    private readonly rowCount: number;
    /**
     * 字段名
     * @private
     */
    private readonly fieldNames: string[];
    /**
     * 字段类型
     * @private
     */
    private readonly fieldTypes: string[];
    /**
     * 输出类型
     * @private
     */
    private readonly fieldOutputTypes:OutputType[];

    constructor(cfgConfig: ExcelToCfg, sheet: Excel.Worksheet) {
        this.logger = cfgConfig.logger;
        this.cfgConfig = cfgConfig;
        this.sheet = sheet;

        this.columnCount = this.actualColumnLength();
        this.rowCount = this.actualRowLength();
        this.fieldOutputTypes = this.getFieldOutputTypes();
        this.fieldNames = this.getFieldNames();
        this.fieldTypes = this.getFieldTypes();

        this.logger("处理excel["+cfgConfig.getFileName()+"] ["+cfgConfig.getCfgPrefix()+"_"+ sheet.name + "] 行数:"+this.rowCount+" 列数:"+this.columnCount + "\n");
    }

    /**
     * 得到cell的值.
     * @param cell
     * @param type 类型
     */
    private cellValue(cell:Excel.Cell, type : string = 'string'): number|string {
        function getterVal(){
            if (cell.value == null) {
                return '';
            }

            if (cell.type == Excel.ValueType.Formula) {
                return (<Excel.CellFormulaValue>cell.value).result + '';
            }

            return cell.value.toString().trim();
        }
        let result = getterVal();
        if (type === 'string') {
            return result;
        }
        return Number(result);
    }
    /**
     * 实际的列数
     * @param sheet
     */
    private actualColumnLength() {
        let row = this.sheet.getRow(4);
        let index = 1;
        for (; index <= row.actualCellCount;) {
            if (this.cellValue(row.getCell(index)) === '') {
                return index - 1;
            }
            index++;
        }
        return Math.min(row.actualCellCount, index);
    }

    /**
     * 实际的行数
     * @param sheet
     */
    private actualRowLength() {
        let index = 1;
        for (; index <= this.sheet.actualRowCount;) {
            if (this.cellValue(this.sheet.getRow(index).getCell(1)) === '') {
                break;
            }
            index++;
        }
        return Math.min(this.sheet.actualRowCount, index);
    }

    /**
     * 获取fieldNames
     * @private
     */
    private getFieldNames():string[] {
        let fieldNames: string[] = [];
        let nameRow = this.sheet.getRow(2)
        for (let i = 1; i <= this.columnCount; i++) {
            fieldNames.push(this.cellValue(nameRow.getCell(i)).toString());
        }
        return fieldNames;
    }
    /**
     * 获取fieldTypes
     * @private
     */
    private getFieldTypes():string[] {
        let fieldTypes: string[] = [];
        let typeRow = this.sheet.getRow(3)
        for (let i = 1; i <= this.columnCount; i++) {
            fieldTypes.push(this.cellValue(typeRow.getCell(i)).toString());
        }
        return fieldTypes;
    }

    /**
     * 输出类型
     * @private
     */
    private getFieldOutputTypes(): OutputType[] {
        let fieldOutputTypes:OutputType[] = [];
        let createTypeRow = this.sheet.getRow(4)
        for (let i = 1; i <= this.columnCount; i++) {
            let outputTypeString:string = this.cellValue(createTypeRow.getCell(i)).toString();
            let outputType:OutputType = (<any>OutputType)[outputTypeString];
            fieldOutputTypes.push(outputType)
        }
        return fieldOutputTypes;
    }

    /**
     * 真实名称
     * @private
     */
    private realName():string {
        let splits = this.sheet.name.split(".");
        return splits[splits.length - 1];
    }

    /**
     * 输出的模板类型
     * @private
     */
    private outputTemplates(): Set<string> {
        let set = new Set(this.sheet.name.split("."));
        set.delete(this.realName());
        let justClient = set.has("c");
        let justServer = set.has("s");
        set.delete("c");
        set.delete("s");

        if (justServer) {
            // 服务器只用json格式
            set.clear();
        }

        if (! justClient || set.size == 0) {
            set.add('json');
        }
        return set;
    }

    /**
     * 处理单个sheet
     * @param sheet sheet
     * @private
     */
    public handlerSheet() {
        if (this.cfgConfig.role == Role.SERVER && this.sheet.name.indexOf("c.") != -1) {
            return;
        }

        if (this.cfgConfig.role == Role.CLIENT && this.sheet.name.indexOf("s.") != -1) {
            return;
        }

        let ignoreFieldIndex = -1;
        this.fieldNames.find((element, index, arr) => {
            if (element === '.ignore') {
                ignoreFieldIndex = index;
            }
        });

        let excelCfg: ExcelCfg = new ExcelCfg();
        for (let i = 5; i <= this.rowCount; i++) {
            let row = this.sheet.getRow(i);
            if (ignoreFieldIndex >= 0
                && trueValSet.has(this.cellValue(row.getCell(ignoreFieldIndex + 1)).toString().toLowerCase()))
            {
                continue;
            }

            let dataList: ExcelRowCfg = new ExcelRowCfg();
            for (let j = 1; j <= this.columnCount; j++) {
                let outputType = this.fieldOutputTypes[j - 1];
                if (outputType == OutputType.IGNORE || j === (ignoreFieldIndex + 1)) {
                    continue;
                }

                if (this.cfgConfig.role == Role.CLIENT && outputType == OutputType.SERVER) {
                    continue;
                }

                if (this.cfgConfig.role == Role.SERVER && outputType == OutputType.CLIENT) {
                    continue;
                }

                let data: UnitData = new UnitData();
                data.type = this.fieldTypes[j - 1];
                data.name = this.fieldNames[j - 1];
                data.val = this.cellValue(row.getCell(j), data.type);
                dataList.addData(data);
            }
            excelCfg.addData(dataList);
        }

        this.output(excelCfg, this.outputTemplates());
    }

    /**
     * 处理数据
     * @param data
     * @param outputPath
     * @param templateDir
     * @param useTypes
     */
    public output(data: ExcelCfg, useTypes: Set<string>) {
        useTypes.forEach(key => {
            const templateFilePath:string = Path.join(Constants.ejsTemplateDir(), key + ".ejs");
            ejs.renderFile(templateFilePath, data, ((err, content) => {
                if (err) {
                    console.error(err);
                    return;
                }
                let fileName: string =  this.cfgConfig.getCfgPrefix() + "_" + this.sheet.name + "."+key;
                this.cfgConfig.outputDirPaths.forEach((outputDir) => {
                    let filePath = Path.join(outputDir, Path.dirname(this.cfgConfig.fileRelativePath), fileName);
                    if (!fs.existsSync(Path.dirname(filePath))) {
                        fs.mkdirSync(Path.dirname(filePath), { recursive: true });
                    }
                    fs.writeFile(filePath, content, (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                });
            }));
        });
    }
}
//
// let excelToCfg = new ExcelToCfg(Role.SERVER, "G全局表_global_setting.xlsx", __dirname, [__dirname]);
// excelToCfg.convert()
