import {TextDecoder, TextEncoder} from "util";

export class ByteInputBuffer {
    // 低位编码. java  网络等都使用高位编码. 默认false
    private littleEndian: boolean = false;

    private view:Buffer;
    private readIndex: number = 0;

    constructor(data: Uint8Array) {
        this.view = Buffer.from(data);
    }

    public readByte(): number{
        return this.view.readInt8(this.readIndexAdd(1))
    }

    public readShort(): number{
        return this.view.readInt16BE(this.readIndexAdd(2))
    }
    public readInt(): number{
        return this.view.readInt32BE(this.readIndexAdd(4))
    }
    public readFloat():number {
        return this.view.readFloatBE(this.readIndexAdd(4));
    }

    public readDouble():number {
        return this.view.readDoubleBE(this.readIndexAdd(8));
    }

    public readBytes(length: number): Uint8Array{
        let start = this.readIndexAdd(length);
        return this.view.slice(start, start + length);
    }

    public readString(): string{
        let length:number = this.readShort();
        if (length == 0) return "";

        let data: Uint8Array = this.readBytes(length);
        return new TextDecoder().decode(data);
    }

    private readIndexAdd(val:number):number {
        let currIndex = this.readIndex;
        this.readIndex += val;
        if (this.readIndex > this.view.buffer.byteLength) {
            throw new Error("readIndex is out range")
        }
        return currIndex;
    }

    public reset(): void{
        this.readIndex = 0;
    }

    public isEmpty(): boolean {
        return this.lastLength() === 0;
    }

    public lastLength(): number {
        return this.view.length - this.readIndex;
    }
}


export class ByteOutputBuffer {
    private readonly capacity:number;
    // 低位编码. java  网络等都使用高位编码. 默认false
    private littleEndian: boolean = false;

    private readonly array:ArrayBuffer;
    private view:DataView;
    private writeIndex: number = 0;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.array = new ArrayBuffer(capacity);
        this.view = new DataView(this.array);
    }

    public writeInt(intNum : number){
        this.view.setInt32(this.writeIndexAdd(4), intNum & 0xffffffff, this.littleEndian)
    }

    public writeShort(shortNum : number){
        this.view.setInt16(this.writeIndexAdd(2), shortNum & 0xffff, this.littleEndian)
    }

    public writeByte(byteNum: number) {
        this.view.setInt8(this.writeIndexAdd(1), byteNum & 0xff)
    }

    public writeDouble(doubleNum: number): void {
        this.view.setFloat64(this.writeIndexAdd(8), doubleNum);
    }
    public writeFloat(floatNum:number): void {
        this.view.setFloat32(this.writeIndexAdd(4), floatNum);
    }

    public writeString(str: string){
        let data:Uint8Array = new TextEncoder().encode(str);
        this.writeShort(data.byteLength)
        this.writeBytes(data)
    }

    public writeBytes(arr: Uint8Array) {
        for (let i = 0 ; i < arr.byteLength; i++) {
            this.writeByte(arr[i]);
        }
    }


    private writeIndexAdd(val:number):number {
        let currIndex = this.writeIndex;
        this.writeIndex += val;
        if (this.writeIndex > this.capacity) {
            throw new Error("ByteOutputBuffer capacity is not enough!");
        }
        return currIndex;
    }
    public reset(): void{
        this.writeIndex = 0;
    }

    /***
     * 转换成可以直接发送的Int8Array
     * @returns {Int8Array}
     */
    public toByteArray():Uint8Array{
        return new Uint8Array(this.array);
    }
}
