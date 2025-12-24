import { REST, Routes } from "discord.js";
import { statusCommandBuilder } from "../events/commands/statusCommandBuilder.js";

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_TOKEN!
);

async function register() {
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID!,
      process.env.GUILD_ID!
    ),
    {
      body: [
        statusCommandBuilder.toJSON()
      ]
    }
  );

  console.log("Registered /status command");
}

register().catch(err => {
  console.error(err);
  process.exit(1);
});