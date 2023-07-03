export default class SampConfig {
	public passworded: boolean = false;
	public playersCount: number = 0;
	public maxPlayersCount: number = 0;
	public hostname: string = "SA:MP server";
	public gamemode: string = "Unknown";
	public mapname: string = "Unknown";

	public setPassworded(passworded: boolean) {
		this.passworded = passworded;
		return this;
	}

	public setPlayersCount(playersCount: number) {
		this.playersCount = playersCount;
		return this;
	}

	public setMaxPlayersCount(maxPlayersCount: number) {
		this.maxPlayersCount = maxPlayersCount;
		return this;
	}

	public setHostname(hostname: string) {
		this.hostname = hostname;
		return this;
	}

	public setGamemode(gamemode: string) {
		this.gamemode = gamemode;
		return this;
	}

	public setMapname(mapname: string) {
		this.mapname = mapname;
		return this;
	}

	public getBuffer() {
		const buffer = Buffer.alloc(
			30 + this.hostname.length + this.gamemode.length + this.mapname.length
		);
		let offset = 11;

		// passworded
		buffer.writeUInt8(Number(this.passworded), offset);
		offset += 1;

		// players
		buffer.writeUInt16LE(this.playersCount, offset);
		offset += 2;

		// maxplayers
		buffer.writeUInt16LE(this.maxPlayersCount, offset);
		offset += 2;

		// hostname
		buffer.writeUInt16LE(this.hostname.length, offset);
		offset += 4;
		for (let i = offset; i < offset + this.hostname.length; i++) {
			buffer[i] = this.hostname.charCodeAt(i - offset);
		}
		offset += this.hostname.length;

		// gamemode
		buffer.writeUInt16LE(this.gamemode.length, offset);
		offset += 4;
		for (let i = offset; i < offset + this.gamemode.length; i++) {
			buffer[i] = this.gamemode.charCodeAt(i - offset);
		}
		offset += this.gamemode.length;

		// mapname
		buffer.writeUInt16LE(this.mapname.length, offset);
		offset += 4;
		for (let i = offset; i < offset + this.mapname.length; i++) {
			buffer[i] = this.mapname.charCodeAt(i - offset);
		}
		offset += this.mapname.length;

		return buffer;
	}
}
