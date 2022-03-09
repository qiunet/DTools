/**
 * 请求协议信息
 */
export class RequestProtoInfo {

    protocolID: number;

    className: string;

    comment: string;


    constructor(protocolID: number, className: string, comment: string|null) {
        this.comment = comment === null ? '': comment;
        this.protocolID = protocolID;
        this.className = className;
    }
}
