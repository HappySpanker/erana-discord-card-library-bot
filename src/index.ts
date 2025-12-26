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

/**
 * Handle uncaught exceptions/errors
 */
process.on("uncaughtException", (error: Error) => {
  if (isShuttingDown)
    return;

  isShuttingDown = true;
  console.error(`Uncaught exception: '${error.name}'; shutting down.`);

  process.exit(1);
})

/**
 * Handle unhandled rejections
 */
process.on("unhandledRejection", (reason: unknown) => {
  console.error(`Unhandled rejection: '${reason}';continuing...`);
})

/**
 * Handle attaching to already rejecte promise
 */
process.on("rejectionHandled", () => {
  console.warn("Late promise handler attached");
});

if (!process.env.DISCORD_TOKEN) {
  throw new Error("Discord token expected in environment variables but not found.")
}

await new DiscordClient()
  .connect();