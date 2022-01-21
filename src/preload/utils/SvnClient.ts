
import * as process from "child_process";
/**
 * svn 客户端
 */
export class SvnClient {
    /**
     * 执行svn 命令
     * @param command svn 指令
     * @param params
     * @private
     */
    private static cmd(command: string, ... params: string[]): Promise<string> {
        return new Promise<string>(function (resolve, reject) {
            let svnParams = [command, '--non-interactive', '--trust-server-cert'];
            let resultText = '';
            if (params) {
                svnParams = svnParams.concat(params);
            }
            const proc = process.spawn('svn', svnParams, {});
            proc.stdout.on('data', function (data: any) {
               resultText += (String(data))
            });

            proc.stderr.on("data", function (data: Buffer) {
                resultText += String(data);
                reject(resultText);
            });

            proc.on('error', function (err: any) {
                reject(err);
            });

            proc.on('close', function(code: number) {
               if (code === 0) {
                    resolve(resultText);
                } else {
                   reject('proc exit code: '+code)
               }
            });
        });
    }
    /**
     * 更新
     */
    public static update(path: string): Promise<string> {
        return this.cmd('update', path);
    }
    /**
     * info
     */
    public static info(path: string): Promise<string> {
        return  this.cmd('info', path);
    }
    /**
     * 清理
     */
    public static cleanup(path: string): Promise<string> {
        return this.cmd('cleanup', path);
    }
    /**
     * 提交
     */
    public static commit(path: string): Promise<string> {
        return this.info(path).then(str => {
            return this.cmd("commit", path);
        }).catch(str => {
            return this.cmd("add", path).then(str => {
                return this.cmd("commit", path);
            });
        });
    }
    /**
     * 锁定锁定
     */
    public static lock(path: string): Promise<string> {
        return this.cmd('lock', path)
    }

    /**
     * 查看状态.
     * @param path
     */
    public static status(path: string): Promise<string> {
        return this.cmd('status', path);
    }
    /**
     * 解除锁定
     */
    public static unlock(path: string): Promise<string> {
        return this.cmd('unlock', path)
    }
}
