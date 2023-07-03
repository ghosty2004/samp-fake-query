export default class SampPlayer {
	public players: Array<{
		id: number;
		name: string;
		score: number;
		ping: number;
	}> = [];

	public addPlayer(id: number, name: string, score: number, ping: number) {
		if (this.players.some((s) => s.id === id)) return;
		this.players.push({
			id,
			name,
			score,
			ping,
		});
	}

	public updatePlayerName(id: number, newName: string) {
		const player = this.players.find((s) => s.id === id);
		if (!player) return;
		player.name = newName;
	}

	public updatePlayerScore(id: number, newScore: number) {
		const player = this.players.find((s) => s.id === id);
		if (!player) return;
		player.score = newScore;
	}

	public updatePlayerPing(id: number, newPing: number) {
		const player = this.players.find((s) => s.id === id);
		if (!player) return;
		player.ping = newPing;
	}

	public removePlayer(id: number) {
		this.players = this.players.filter((s) => s.id !== id);
	}

	public getBuffer(type: "all" | "partial") {
		const buffer = Buffer.alloc(
			33 +
				this.players.reduce(
					(length, player) => length + 20 + player.name.length,
					0
				)
		);
		let offset = 11;

		buffer.writeUInt16LE(this.players.length, offset);
		offset += 2;

		switch (type) {
			case "all":
				this.players.forEach((player) => {
					buffer.writeUInt8(player.id, offset);
					++offset;

					buffer.writeUInt8(player.name.length, offset);
					++offset;
					for (let i = offset; i < offset + player.name.length; i++) {
						buffer[i] = player.name.charCodeAt(i - offset);
					}
					offset += player.name.length;

					buffer.writeUInt16LE(player.score, offset);
					offset += 4;

					buffer.writeUInt8(player.ping, offset);
					offset += 4;
				});
				break;
			case "partial":
				this.players.forEach((player) => {
					buffer.writeUInt8(player.name.length, offset);
					++offset;
					for (let i = offset; i < offset + player.name.length; i++) {
						buffer[i] = player.name.charCodeAt(i - offset);
					}
					offset += player.name.length;

					buffer.writeUInt16LE(player.score, offset);
					offset += 4;
				});
		}

		return buffer;
	}
}
