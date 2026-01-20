import { ButtonStyle, ContainerBuilder, MessageFlags, ModalSubmitInteraction, UserSelectMenuBuilder } from "discord.js";
import { IModalHandler } from "./ModalSubmitDispatcher.js";
import { EphemeralReply } from "../utils/InteractionHelpers.js";
import { CardUploadRequest } from "../../orchestration/models/CardUploadRequest.js";
import { CreateMyCardOrchestrator, IMyCardsOrchestrator } from "../../orchestration/CardsOrchestrator.Mine.js";
import { CardBuilder } from "../builders/components/CardBuilder.js";
import { UploadedCardBuilder } from "../builders/components/UploadedCardBuilder.js";

export class CardUpload implements IModalHandler {
  static Identifier = "CardUpload"

  constructor(
    private readonly _myCardOrchestrator: IMyCardsOrchestrator
  ) { }

  async Handle(interaction: ModalSubmitInteraction): Promise<void> {
    const visibilityValues = interaction.fields.getStringSelectValues("visibility");
    const tagline = interaction.fields.getTextInputValue("tagline");
    const card = interaction.fields.getUploadedFiles("card");

    // Sanity checks
    if (!visibilityValues) {
      await EphemeralReply(interaction, "Didn't set Visibility?");
      return;
    }

    const visibility = visibilityValues[0]; // Must be one
    if (!visibility) {
      await EphemeralReply(interaction, "Didn't set Visibility?");
      return;
    }

    if (!card) {
      await EphemeralReply(interaction, "No file uploaded?");
      return;
    }

    const attachment = card.first();
    if (!attachment) {
      await EphemeralReply(interaction, "No file uploaded, collection empty?");
      return;
    }

    // Defer the interaction and mark as ephemeral
    await interaction.deferReply({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })

    // Get card bytes from Discord
    const response = await fetch(attachment.url);
    const json = await response.text();

    // Build a card upload request
    const cardUloadRequest: CardUploadRequest = {
      CanonicalUserId: interaction.user.id,
      Visibility: visibility,
      Tagline: tagline,
      Json: json
    }

    const cardUploadResponse = await this._myCardOrchestrator
      .UploadJson(cardUloadRequest);

    // TODO: remove me after implementation of image handling
    cardUploadResponse.item.URL = "https://img.happyspanker.nl/1_9Zl58sA5eKGmCVyK-2xQ.png";

    await interaction.editReply({
      components: [ UploadedCardBuilder(cardUploadResponse.item) ],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
    });
  }
}