import { ChatInputCommandInteraction, CacheType, MessageFlags, EmbedBuilder, MessagePayload, InteractionEditReplyOptions } from "discord.js";
import { ISlashCommandHandler } from "./interfaces/ICommandHandler.js";
import { StatusSlashCommandHandler } from "./Status.js";
import { slashCommandInteractionLogger } from "../../logger.js";
import { CardsSlashCommandsHandler } from "./Cards.js";
import { GenericErrorEmbed, GenericExceptionEmbed } from "../utils/Embeds.js";
import { title } from "node:process";

export class Dispatcher 
    implements ISlashCommandHandler {
    private _handlerMapping = new Map<string, ISlashCommandHandler>([
        ["status", new StatusSlashCommandHandler()],
        ["cards", new CardsSlashCommandsHandler()],
    ]);

    async handle(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
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
            await handler.handle(interaction);
        } catch(err) {
            // Log
            logger.error({
                err,
                event: "slash_command_dispatch_error"
            }, "Calling dispatched handler failed");

            // Prepare embed
            const payload = {
                embeds: [ err instanceof Error
                    ? GenericExceptionEmbed(err)
                    : GenericErrorEmbed(err) ],
            };

            // Reply/Edit/Followup
            if (interaction.deferred) {
                interaction.editReply(payload);
            } else if (interaction.replied) {
                interaction.followUp(payload);
            } else {
                interaction.reply(payload);
            }
        }
    }
}