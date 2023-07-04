# Fake SA:MP (San Andreas Multi Player) query

#### With this module you can create SA:MP servers which send back fake query to clients

<img src="https://i.imgur.com/oJDjxOI.png" />

#### Example of usage:

```ts
import { SampServer } from "samp-fake-query";
const server = new SampServer("0.0.0.0", 7777);

// Set server config
server.config.setPassworded(true);
server.config.setPlayersCount(10);
server.config.setMaxPlayersCount(100);
server.config.setHostname("My SA:MP server");
server.config.setGamemode("Unknown");
server.config.setMapname("English");

// Add rules
server.rules.addRule("weburl", "github.com/ghosty2004");
server.rules.addRule("owner", "ghosty2004");

// Add players
server.players.addPlayer(0, "ghosty2004", 1, 1);

// Listen for events
server.on("listening", (ip, port) => {
	console.log(`SA:MP fake query listening on ${ip}:${port}`);
});

server.on("requestData", (clientIp, clientPort, opcode) => {
	console.log(
		`Received request from ${clientIp}:${clientPort} for opcode ${opcode}`
	);
});
```
