import { ModalSubmitInteraction } from "discord.js";
import { IModalHandler } from "./ModalDispatcher.js";
import { logger } from "../../logger.js";

export class CardUpload implements IModalHandler {
    static customId = "CardUpload"

    async handle(interaction: ModalSubmitInteraction): Promise<void> {
        logger.debug({
            val1: interaction.fields.getTextInputValue("hobbiesInput")
        }, "something happened!");

        interaction.reply(interaction.fields.getTextInputValue("hobbiesInput"));
    }
}