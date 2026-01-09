import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { IModalHandler } from "./ModalDispatcher.js";
import { logger } from "../../logger.js";
import { EphemeralReply } from "../utils/InteractionHelpers.js";
import { CardUploadRequest } from "../../orchestration/models/CardUploadRequest.js";
import { myCardsOrchestrator } from "../../orchestration/CardsOrchestrator.Mine.js";

export class CardUpload implements IModalHandler {
    static customId = "CardUpload"

    async handle(interaction: ModalSubmitInteraction): Promise<void> {
        const visibilityValues = interaction.fields.getStringSelectValues("visibility");
        const tagline = interaction.fields.getTextInputValue("tagline");
        const card = interaction.fields.getUploadedFiles("card");

        // Sanity checks
        if (!visibilityValues) {
            await EphemeralReply(interaction, "Didn't set Visibility?");
            return;
        }

        const visibility = visibilityValues[0]; // Must be one
        if(!visibility) {
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
        interaction.deferReply({ flags: MessageFlags.Ephemeral })

        // Get card bytes from Discord
        const response = await fetch(attachment.url);
        const json = await response.text();

        // Build a card upload request
        const cardUloadRequest: CardUploadRequest = {
            Visibility: visibility,
            Tagline: tagline,
            Json: json
        }

        const cardUploadResponse = await myCardsOrchestrator.uploadJson(cardUloadRequest);

        interaction.editReply(cardUploadResponse.item.Tagline);
    }
}