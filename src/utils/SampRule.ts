export default class SampRules {
	public rules: Array<{
		name: string;
		value: string;
	}> = [];

	public addRule(name: string, value: string) {
		if (this.rules.some((s) => s.name === name)) return;
		this.rules.push({
			name,
			value,
		});
	}

	public updateRule(name: string, newValue: string) {
		const rule = this.rules.find((s) => s.name === name);
		if (!rule) return;
		rule.value = newValue;
	}

	public removeRule(name: string) {
		this.rules = this.rules.filter((s) => s.name !== name);
	}

	public getBuffer() {
		const buffer = Buffer.alloc(
			30 +
				Object.entries(this.rules).reduce(
					(length, [key, value]) =>
						length + key.length + value.toString().length,
					0
				)
		);
		let offset = 11;

		buffer.writeUInt16LE(this.rules.length, offset);
		offset += 2;

		this.rules.forEach(({ name, value }) => {
			buffer.writeUInt16LE(name.length, offset);
			++offset;
			for (let i = offset; i < offset + name.length; i++) {
				buffer[i] = name.charCodeAt(i - offset);
			}
			offset += name.length;

			buffer.writeUInt16LE(value.length, offset);
			++offset;
			for (let i = offset; i < offset + value.length; i++) {
				buffer[i] = value.charCodeAt(i - offset);
			}
			offset += value.length;
		});

		return buffer;
	}
}
