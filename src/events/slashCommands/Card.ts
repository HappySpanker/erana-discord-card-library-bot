import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { ISlashCommandHandler } from "./interfaces/ICommandHandler.js";
import { logger } from "../../logger.js";

export const CardSlashCommandBuilder = new SlashCommandBuilder()
  .setName("card")
  .setDescription("Handles singlle card actions")
  .addSubcommand(sub => sub
    .setName("upload")
    .setDescription("Handled uploaded a new card")
    .addStringOption(opt => opt
      .setName("visibility")
      .setDescription("What should the visibility of your card be?")
      .setRequired(true)
      .addChoices([
        { name: "Private", value: "private" },
        { name: "Shared", value: "shared" },
        { name: "Listed", value: "listed" },
        { name: "Public", value: "public" },
      ])
    )
    .addStringOption(opt => opt
      .setName("tagline")
      .setRequired(true)
      .setDescription("A tagline that will really sell your card!")
    )
    .addAttachmentOption(opt => opt
      .setName("card")
      .setRequired(true)
      .setDescription("The card (either PNG or JSON) to upload")
    )
  )

export class CardSlashCommandHandler implements ISlashCommandHandler {
  static Identifier = "card";

  async Handle(interaction: ChatInputCommandInteraction): Promise<void> {
    switch (interaction.options.getSubcommand(true)) {
      case "upload": return this.upload(interaction);
      default: throw new Error("Invalid subcommand received");
    }
  }

  private async upload(interaction: ChatInputCommandInteraction): Promise<void> {
    const visibility = interaction.options.getString("visibility");
    const tagline = interaction.options.getString("tagline");
    const card = interaction.options.getAttachment("card");

    // Sanity checks
    if (!visibility) throw new Error("Visibility not set");
    if (!card) throw new Error("Card missing");

    logger.trace({
      visibility,
      tagline,
      card: {
        name: card.name,
        size: card.size
      }
    })

    interaction.reply({
      content: "upload",
      flags: MessageFlags.Ephemeral
    })
  }
}