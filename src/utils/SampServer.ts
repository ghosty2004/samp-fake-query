import { createSocket, Socket, RemoteInfo } from "node:dgram";

import SampConfig from "./SampConfig";
import SampPlayer from "./SampPlayer";
import SampRules from "./SampRule";

export default class SampServer {
	private listenAddress: string;
	private listenPort: number;
	private server: Socket;

	public config = new SampConfig();
	public rules = new SampRules();
	public players = new SampPlayer();

	constructor(listenAddress: string, listenPort: number) {
		this.listenAddress = listenAddress;
		this.listenPort = listenPort;
		this.server = createSocket("udp4");
		this.server.on("message", this.handlePacket.bind(this));
		this.server.bind(this.listenPort, this.listenAddress);
	}

	private handlePacket(packet: Buffer, remoteInfo: RemoteInfo) {
		const opcode = String.fromCharCode(packet[10]);

		let responseBuffer: Buffer | undefined;

		switch (opcode) {
			case "p":
				responseBuffer = packet;
				break;
			case "i":
				responseBuffer = this.config.getBuffer();
				packet.copy(responseBuffer, 0);
				break;
			case "r":
				responseBuffer = this.rules.getBuffer();
				packet.copy(responseBuffer, 0);
				break;
			case "d":
				responseBuffer = this.players.getBuffer("all");
				packet.copy(responseBuffer, 0);
				break;
			case "c":
				responseBuffer = this.players.getBuffer("partial");
				packet.copy(responseBuffer, 0);
		}

		if (typeof responseBuffer === "undefined") return;

		this.server.send(responseBuffer, remoteInfo.port, remoteInfo.address);
	}
}
