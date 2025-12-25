import { DiscordClient } from "./events/DiscordClient.js";

let isShuttingDown = false;

/**
 * Handle SIGTERM event
 */
process.on("SIGTERM", () => {
  if (isShuttingDown) 
    return; // No need
  
  isShuttingDown = true;
  console.log("Received SIGTERM, gracefully shutting down...");

  // Shut down externals here
  console.log("Shut down gracefully; good night sweet prince.")

  process.exit(0);
})

/**
 * Handle SIGINT event
 */
process.on("SIGINT", () => {
  if (isShuttingDown)
    return; // No need

  isShuttingDown = true;

  console.log("Received SIGINT, shutting down now...");
 
  process.exit(0);
})

if (!process.env.DISCORD_TOKEN) {
  throw new Error("Discord token expected in environment variables but not found.")
}

const discordClient = new DiscordClient()

discordClient.registerSlashCommands();

discordClient.registerClientReady();

await discordClient.connect();