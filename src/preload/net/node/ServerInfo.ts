export class ServerInfo {
  readonly serverPort: number;
  readonly serverId: number;
  readonly nodePort: number;
  readonly host: string;


  constructor(data: any) {
    this.serverPort = data.serverPort;
    this.serverId = data.serverId;
    this.nodePort = data.nodePort;
    this.host = data.host;
  }
}
