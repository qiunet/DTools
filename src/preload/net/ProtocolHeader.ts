import {ByteInputBuffer, ByteOutputBuffer} from "./ByteBuffer";

export class ProtocolHeader {
    /**
     * 服务端的 magic
     */
    private static readonly MAGIC_BYTES = [102, 97, 115, 116];
    private static readonly SERVER_REQUEST_HEADER_LENGTH = 16;

    magic: Uint8Array = new Uint8Array(4);
    protocolId: number = 0;
    length: number = 0;
    crc: number = 0;

    /**
     * 服务器对客户端下发
     * @param dis
     */
    static createServerHeaderByBytes(dis: ByteInputBuffer): ProtocolHeader {
        const header = new ProtocolHeader();
        header.length = dis.readInt();
        header.protocolId = dis.readInt();
        return header;
    }

    /**
     * Node server 对客户端下发
     *
     * @param dis
     */
    static createNodeHeaderByBytes(dis: ByteInputBuffer): ProtocolHeader {
        const header = new ProtocolHeader();
        header.magic = dis.readBytes(4);
        header.length = dis.readInt();
        header.protocolId = dis.readInt();
        header.crc = dis.readInt();
        return header;
    }

    /**
     * 上行创建 header
     * @param protocolId
     * @param crc
     */
    static create(protocolId: number, crc: number = 0): ProtocolHeader {
        const header = new ProtocolHeader();
        header.magic.set(ProtocolHeader.MAGIC_BYTES)
        header.protocolId = protocolId;
        header.length = 0;
        header.crc = crc;
        return header;
    }


    toByteArray = (data: Uint8Array):Uint8Array => {
        const buffer = new ByteOutputBuffer(ProtocolHeader.SERVER_REQUEST_HEADER_LENGTH + data.length);
        buffer.writeBytes(this.magic);
        buffer.writeInt(data.length)
        buffer.writeInt(this.protocolId)
        buffer.writeInt(this.crc)
        buffer.writeBytes(data)
        return buffer.toByteArray();
    }

    toString(): string {
        return JSON.stringify(this, null)
    }
}