import { ModalSubmitInteraction } from "discord.js";
import { logger } from "../../logger.js";
import { safeErrorReply } from "../utils/Errors.js";

export interface IModalHandler {
    Handle(interaction: ModalSubmitInteraction): Promise<void>
}

export interface IModalSubmitDispatcher {
    Dispatch(interaction: ModalSubmitInteraction): Promise<void>;
}

export class ModalSubmitDispatcher implements IModalSubmitDispatcher {
    private readonly _handerMapping = new Map<string, IModalHandler>();

    async Dispatch(interaction: ModalSubmitInteraction): Promise<void> {
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
            await handler.Handle(interaction);
        } catch (err) {
            // Log
            logger.error({
                err,
                event: "modal_dispatch_error"
            }, "Calling modal dispatch handler failed");

            safeErrorReply(interaction, err);
        }
    }

    RegisterHandler(key: string, handler: IModalHandler) {
        this._handerMapping.set(key, handler);
    }
}

export function CreateModalDisparcher() {
    return new ModalSubmitDispatcher();
}