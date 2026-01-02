import { ModalSubmitInteraction } from "discord.js";
import { logger } from "../../logger.js";
import { CardUpload } from "./CardUpload.js";
import { safeErrorReply } from "../utils/Errors.js";

export interface IModalHandler {
    handle(interaction: ModalSubmitInteraction): Promise<void>
}

export class ModalDispatcher {
    private readonly _handerMapping = new Map<string, IModalHandler>([
        [CardUpload.customId, new CardUpload()]
    ])

    async dispatch(interaction: ModalSubmitInteraction): Promise<void> {
        const handler = this._handerMapping.get(interaction.customId);

        // Sanity check
        if (!handler) {
            const msg = `Received request for '${interaction.customId}' modal handler, but not found`;
            logger.error({
                    customId: interaction.customId
                }, 
                msg);

            safeErrorReply(interaction, msg);

            return;
        }

        // Do something
        try {
            await handler.handle(interaction);
        } catch (err) {
            // Log
            logger.error({
                err,
                event: "modal_dispatch_error"
            }, "Calling modal dispatch handler failed");

            safeErrorReply(interaction, err);
        }
    }
}