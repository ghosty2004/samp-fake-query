import { createSocket, Socket, RemoteInfo } from "node:dgram";
import { EventEmitter } from "node:events";

import SampConfig from "./SampConfig";
import SampPlayer from "./SampPlayer";
import SampRules from "./SampRule";

type SampServerEventMap = {
	listening: [ip: string, port: number];
	requestData: [clientIp: string, clientPort: number, opcode: string];
};

class TypedEventEmitter<U extends Record<string, any>> {
	private eventEmitter: EventEmitter;

	constructor() {
		this.eventEmitter = new EventEmitter();
	}

	on<K extends keyof U>(event: K, listener: (...args: U[K]) => void) {
		this.eventEmitter.on(event as string, listener);
	}

	emit<K extends keyof U>(event: K, ...args: any) {
		this.eventEmitter.emit(event as string, ...args);
	}
}

export default class SampServer {
	private listenAddress: string;
	private listenPort: number;
	private server: Socket;
	private eventEmitter = new TypedEventEmitter<SampServerEventMap>();

	public config = new SampConfig();
	public rules = new SampRules();
	public players = new SampPlayer();

	constructor(listenAddress: string, listenPort: number) {
		this.listenAddress = listenAddress;
		this.listenPort = listenPort;
		this.server = createSocket("udp4");
		this.server.on("message", this.handlePacket.bind(this));
		this.server.on("listening", () =>
			this.emit("listening", this.listenAddress, this.listenPort)
		);
		this.server.bind(this.listenPort, this.listenAddress);
	}

	private handlePacket(packet: Buffer, remoteInfo: RemoteInfo) {
		const opcode = String.fromCharCode(packet[10]);

		this.emit("requestData", remoteInfo.address, remoteInfo.port, opcode);

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

	public on<K extends keyof SampServerEventMap>(
		event: K,
		listener: (...args: SampServerEventMap[K]) => void
	) {
		this.eventEmitter.on(event, listener);
	}

	public emit<K extends keyof SampServerEventMap>(
		event: K,
		...args: SampServerEventMap[K]
	) {
		this.eventEmitter.emit(event, ...args);
	}
}
