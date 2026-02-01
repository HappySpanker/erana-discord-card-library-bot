import { ChatInputCommandInteraction, CacheType, MessageFlags } from "discord.js";
import { ISlashCommandHandler } from "./interfaces/ICommandHandler.js";
import { logger, slashCommandInteractionLogger } from "../../logger.js";
import { GenericErrorEmbed } from "../utils/Embeds.js";

export interface ISlashCommandDispatcher {
    Dispatch(interaction: ChatInputCommandInteraction<CacheType>): Promise<void>;
    RegisterHandlers(handlers: ISlashCommandHandler[]): void;
}

class SlashCommandDispatcher {
    constructor(
        private _handlerMapping = new Map<string, ISlashCommandHandler>()
    ){ }

    async Dispatch(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const logger = slashCommandInteractionLogger(interaction);

        logger.debug(
            {event: "slash_command_received"},
            "Slash Command received"
        );
        
        let handler = this._handlerMapping.get(interaction.commandName);

        // Log if no ISlashCommandHandler is found
        if (!handler) {
            const msg = `Slash Command handler for "${interaction.commandName}" not found`;
            logger.warn(
                {event: "slash_command_handler_not_found"},
            );
            interaction.reply({
                embeds: [ GenericErrorEmbed(msg) ],
                flags: MessageFlags.Ephemeral | MessageFlags.Urgent
            });
            return;
        }

        // Try to call the dispatch handler
        try {
            await handler.Handle(interaction);
        } catch(err) {
            // Log
            logger.error({
                err,
                event: "slash_command_dispatch_error"
            }, "Calling dispatched handler failed");

            // TODO: error handling
        }
    }

    public RegisterHandlers(handlers: ISlashCommandHandler[]) {
        handlers.forEach(handler => {
            const id = handler.Identifier;

            // Duplicates should throw an error
            if (this._handlerMapping.has(id)) {
                throw new Error(`Can not add duplicate identifier '${id}' to SlashCommandDispatcher`)
            }

            logger.trace({
                identifier: id,
            }, `Adding '${id}' to SlashCommandDispatcher`);

            this._handlerMapping.set(id, handler);
        })
    }
}

export function CreateSlashCommandDispatcher(): ISlashCommandDispatcher {
    return new SlashCommandDispatcher();
}