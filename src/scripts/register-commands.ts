import { REST, Routes } from "discord.js";
import { StatusSlashCommandBuilder } from "../events/slashCommands/Status.js";
import { CardSlashCommandBuilder } from "../events/slashCommands/Card.js";
import { MineSlashCommandBuilder } from "../events/slashCommands/Mine.js";

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_TOKEN!
);

async function register() {
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.DISCORD_APPLICATION_ID!,
      process.env.GUILD_ID!
    ),
    {
      body: [
        StatusSlashCommandBuilder.toJSON(),
        CardSlashCommandBuilder.toJSON(),
        MineSlashCommandBuilder.toJSON()
      ]
    }
  );

  console.log("Registered slash commands");
}

register().catch(err => {
  console.error(err);
  process.exit(1);
});