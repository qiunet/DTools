/**
 * 文件节点
 */
export interface IFileNode {
    /**
     * 全路径
     */
    fullPath: string;
    /**
     * 文件名称
     */
    name: string;

    /**
     * 是否是文件夹
     */
    isDir() : boolean;

    /**
     * 是否是文件
     */
    isFile() : boolean;

    /**
     * 子类
     */
    children?: Array<IFileNode>;
}
