import { CacheType, ChatInputCommandInteraction, Interaction, ModalSubmitInteraction } from "discord.js";
import { GenericErrorEmbed, GenericExceptionEmbed } from "./Embeds.js";

export function safeErrorReply(
    interaction: ChatInputCommandInteraction<CacheType> | ModalSubmitInteraction, 
    err: Error | unknown) {
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