import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { ISlashCommandHandler } from "./interfaces/ICommandHandler.js";
import { logger } from "../../logger.js";
import { EphemeralReply, GetJsonFromAttachment, GetJsonFromInteractionByAttachmentName } from "../utils/InteractionHelpers.js";
import { ICardOrchestrator } from "../../orchestration/CardOrchestrator.js";
import { CardUpdateRequest, CardUploadRequest } from "../../orchestration/models/Card.js";

export const CardSlashCommandBuilder = new SlashCommandBuilder()
  .setName("card")
  .setDescription("Handles singlle card actions")
  .addSubcommand(sub => sub
    .setName("upload")
    .setDescription("Handles uploading a new card")
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
      .setDescription("The card (JSON) to upload")
    )
  )
  .addSubcommand(sub => sub
    .setName("update")
    .setDescription("Upload an existing card")
    .addStringOption(opt => opt
      .setName("identifier")
      .setRequired(true)
      .setDescription("The identifier of the card you wish to update")
    )
    .addStringOption(opt => opt
      .setName("visibility")
      .setDescription("What should the new visibility be?")
      .setRequired(false)
      .addChoices([
        { name: "Private", value: "private" },
        { name: "Shared", value: "shared" },
        { name: "Listed", value: "listed" },
        { name: "Public", value: "public" },
      ])
    )
    .addStringOption(opt => opt
      .setName("tagline")
      .setRequired(false)
      .setDescription("What should the new tagline be?")
    )
    .addAttachmentOption(opt => opt
      .setName("card")
      .setRequired(false)
      .setDescription("What should the actual card be?")
    )
  )

export class CardSlashCommandHandler implements ISlashCommandHandler {
  Identifier = "card";

  constructor(
    private readonly cardOrchestrator: ICardOrchestrator
  ) {}

  async Handle(interaction: ChatInputCommandInteraction): Promise<void> {
    switch (interaction.options.getSubcommand(true)) {
      case "update": return this.update(interaction);
      case "upload": return this.upload(interaction);
      default: throw new Error("Invalid subcommand received");
    }
  }
  
  private async update(interaction: ChatInputCommandInteraction): Promise<void> {
    const identifier = interaction.options.getString("identifier");
    const visibility = interaction.options.getString("visibility");
    const tagline = interaction.options.getString("tagline");
    const json = interaction.options.getAttachment("card");

    if (!visibility && !tagline && !json) {
      await EphemeralReply(interaction, "Guess we're not updating anything!");
      return;
    }

    // Sanity checks
    if (!identifier) throw new Error("Identifier not set");

    const request: CardUpdateRequest = {
      CanonicalUserId: interaction.user.id,
      Identifier: identifier
    }

    if (visibility) request.Visibility = visibility;
    if (tagline) request.Tagline = tagline;
    if (json) request.Json = await GetJsonFromAttachment(json);

    // Call orchestrator
    const response = await this.cardOrchestrator.Update(request);

    await EphemeralReply(interaction, "update noop")
  }

  private async upload(interaction: ChatInputCommandInteraction): Promise<void> {
    logger.trace("CardSlashCommandHandler.upload");
    
    const visibility = interaction.options.getString("visibility");
    const tagline = interaction.options.getString("tagline");
    const card = interaction.options.getAttachment("card");

    // Sanity checks
    if (!tagline) throw new Error("Tagline not set");
    if (!visibility) throw new Error("Visibility not set");
    if (!card) throw new Error("Card missing");

    logger.trace({
      visibility,
      tagline,
      card: {
        name: card.name,
        size: card.size
      }
    }, "Handling card upload")

    // Prepare request
    const request: CardUploadRequest = {
      CanonicalUserId: interaction.user.id,
      Tagline: tagline,
      Visibility: visibility,
      Json: await GetJsonFromInteractionByAttachmentName(interaction, "card"),
    }

    // Call orchestrator
    const response = await this.cardOrchestrator.Upload(request);
    
    await EphemeralReply(interaction, response.CardId)
  }
}