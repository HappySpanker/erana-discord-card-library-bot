import { Client, Events, GatewayIntentBits } from "discord.js";
import { env } from "node:process";

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient: Client<true>) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
console.log(env.DISCORD_TOKEN);
client.login(env.DISCORD_TOKEN);