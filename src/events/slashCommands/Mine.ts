import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { ISlashCommandHandler } from "./interfaces/ICommandHandler.js";

export const MineSlashCommandBuilder = new SlashCommandBuilder()
  .setName("mine")
  .setDescription("Handles your own card-related actions")
  .addSubcommand(sub => sub
    .setName("list")
    .setDescription("Shows a list of all your cards")
  )
  .addSubcommand(sub => sub
    .setName("search")
    .setDescription("Searches within your own cards")
    .addStringOption(opt => opt
      .setName("searchtext")
      .setRequired(true)
      .setDescription("Search the database for cards matching this value")
    )
  )

export class MineSlashCommandHandler implements ISlashCommandHandler {
  static Identifier = "mine";

  async Handle(interaction: ChatInputCommandInteraction): Promise<void> {
    switch (interaction.options.getSubcommand(true)) {
      case "list": return this.list(interaction);
      case "search": return this.search(interaction);
      default: throw new Error("Invalid subcommand received");
    }
  }

  
  private async list(interaction: ChatInputCommandInteraction): Promise<void> {
    
    interaction.reply({
      content: "list",
      flags: MessageFlags.Ephemeral
    })
  }
  
  private async search(interaction: ChatInputCommandInteraction): Promise<void> {

    interaction.reply({
      content: "search",
      flags: MessageFlags.Ephemeral
    })
  }
}