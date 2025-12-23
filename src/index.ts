import { Client, Events, GatewayIntentBits } from "discord.js";
import { env } from "node:process";

if (!process.env.DISCORD_TOKEN) {
  throw new Error("Discord token expected in environment variables yet not found.")
}

// Create a new client instance
const client = new Client({   intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ] 
});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, async (readyClient: Client<true>) =>  {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, (message) => {
  if (!message.inGuild()) return;

  console.log("message:", {
      guild: message.guild?.name,
      channe: message.channel.name,
      author: message.author.username,
      content: message.content
    }
  );
});

// Log in to Discord with your client's token
await client.login(env.DISCORD_TOKEN);