import { DiscordClient } from "./events/DiscordClient.js";

if (!process.env.DISCORD_TOKEN) {
  throw new Error("Discord token expected in environment variables but not found.")
}

const discordClient = new DiscordClient()

discordClient.registerSlashCommands();

discordClient.registerClientReady();

await discordClient.connect();