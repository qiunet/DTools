import * as dgram from 'dgram';
import EventEmitter = require('events');
import { IKCP_OVERHEAD, IKCP_MTU_DEF, Kcp } from './kcp';

const mtuLimit = IKCP_MTU_DEF;

export class UDPSession extends EventEmitter {
    key: string;
    conn: dgram.Socket; // the underlying packet connection
    ownConn: boolean; // true if we created conn internally, false if provided by caller
    kcp: Kcp; // KCP ARQ protocol

    // kcp receiving is based on packets
    // recvbuf turns packets into stream
    recvbuf: Buffer;
    bufptr: Buffer;
    // settings
    port: number;
    host: string;

    headerSize: number; // the header size additional to a KCP frame
    ackNoDelay: boolean; // send ack immediately for each incoming packet(testing purpose)
    writeDelay: boolean; // delay kcp.flush() for Write() for bulk transfer

    constructor() {
        super();
        this.ownConn = false;

        // kcp receiving is based on packets
        // recvbuf turns packets into stream
        this.recvbuf = Buffer.alloc(1);
        this.bufptr = Buffer.alloc(1);

        // FEC codec

        // settings
        this.port = 0;

        this.headerSize = 0; // the header size additional to a KCP frame
        this.ackNoDelay = false; // send ack immediately for each incoming packet(testing purpose)
        this.writeDelay = false; // delay kcp.flush() for Write() for bulk transfer
    }

    // Write implements net.Conn
    write(b: Buffer): number {
        return this.writeBuffers([b]);
    }

    // WriteBuffers write a vector of byte slices to the underlying connection
    writeBuffers(v: Buffer[]): number {
        let n = 0;
        for (const b of v) {
            n += b.byteLength;
            this.kcp.send(b);
        }
        return n;
    }

    // Close closes the connection.
    close() {
        // try best to send all queued messages
        this.kcp.flush(false);
        // release pending segments
        this.kcp.release();
        this.conn.close();
    }

    // SetWriteDelay delays write for bulk transfer until the next update interval
    setWriteDelay(delay: boolean) {
        this.writeDelay = delay;
    }

    // SetWindowSize set maximum window size
    setWindowSize(sndwnd: number, rcvwnd: number) {
        this.kcp.setWndSize(sndwnd, rcvwnd);
    }

    // SetMtu sets the maximum transmission unit(not including UDP header)
    setMtu(mtu: number): boolean {
        if (mtu > mtuLimit) {
            return false;
        }

        this.kcp.setMtu(mtu);
        return true;
    }

    // SetStreamMode toggles the stream mode on/off
    setStreamMode(enable: boolean) {
        if (enable) {
            this.kcp.stream = 1;
        } else {
            this.kcp.stream = 0;
        }
    }

    // SetACKNoDelay changes ack flush option, set true to flush ack immediately,
    setACKNoDelay(nodelay: boolean) {
        this.ackNoDelay = nodelay;
    }

    // SetNoDelay calls nodelay() of kcp
    // https://github.com/skywind3000/kcp/blob/master/README.en.md#protocol-configuration
    setNoDelay(nodelay: number, interval: number, resend: number, nc: number) {
        this.kcp.setNoDelay(nodelay, interval, resend, nc);
    }

    // post-processing for sending a packet from kcp core
    // steps:
    // 1. FEC packet generation
    // 2. CRC32 integrity
    // 3. Encryption
    output(buf: Buffer) {
       this.conn.send(buf, this.port, this.host);
    }

    check() {
        if (!this.kcp) {
            return;
        }
        this.kcp.update();
        setTimeout(() => {
            this.check();
        }, this.kcp.check());
    }

    // GetConv gets conversation id of a session
    getConv(): number {
        return this.kcp.conv;
    }

    // GetRTO gets current rto of the session
    getRTO(): number {
        return this.kcp.rx_rto;
    }

    // GetSRTT gets current srtt of the session
    getSRTT(): number {
        return this.kcp.rx_srtt;
    }

    // GetRTTVar gets current rtt variance of the session
    getSRTTVar(): number {
        return this.kcp.rx_rttvar;
    }

    // packet input stage
    packetInput(data: Buffer): void {
       this.kcpInput(data);
    }

    kcpInput(data: Buffer) {
        this.kcp.input(data, true, this.ackNoDelay);
        const size = this.kcp.peekSize();
        if (size > 0) {
            const buffer = Buffer.alloc(size);
            const len = this.kcp.recv(buffer);
            if (len) {
                this.emit('recv', buffer.slice(0, len));
            }
        }
    }

    readLoop() {
        this.conn.on('message', (msg: Buffer) => {
            this.packetInput(msg);
        });
    }
}

// newUDPSession create a new udp session for client or server
function newUDPSession(args: {
    conv: number;
    port: number;
    host: string;
}): UDPSession {
    const { conv, port, host} = args;
    const udpSession = new UDPSession();
    udpSession.port = port;
    udpSession.host = host;
    udpSession.conn = dgram.createSocket('udp4');

    udpSession.recvbuf = Buffer.alloc(mtuLimit);

    udpSession.kcp = new Kcp(conv, udpSession);
    udpSession.kcp.setReserveBytes(udpSession.headerSize);
    udpSession.kcp.setOutput((buff, len) => {
        if (len >= IKCP_OVERHEAD + udpSession.headerSize) {
            udpSession.output(buff.slice(0, len));
        }
    });

    // it's a client connection
    udpSession.readLoop();
    udpSession.check();

    return udpSession;
}


// Dial connects to the remote address "raddr" on the network "udp" without encryption and FEC
export function Dial(conv: number, port: number, host: string): any {
    return DialWithOptions({ conv, port, host });
}

export interface DialOptions {
    conv: number;
    port: number;
    host: string;
}

// DialWithOptions connects to the remote address "raddr" on the network "udp" with packet encryption
//
// 'block' is the block encryption algorithm to encrypt packets.
//
// 'dataShards', 'parityShards' specify how many parity packets will be generated following the data packets.
//
// Check https://github.com/klauspost/reedsolomon for details
export function DialWithOptions(opts: DialOptions): UDPSession {
    const { conv, port, host} = opts;
    return newUDPSession({
        conv,
        port,
        host,
    });
}
