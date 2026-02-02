import { ChatInputCommandInteraction, InteractionResponse, MessageFlags, RepliableInteraction } from "discord.js";
import { logger } from "../../logger.js";

export async function EphemeralReply(interaction: RepliableInteraction, message: string): Promise<InteractionResponse<boolean>> {
    return await interaction.reply({
        content: message,
        flags: MessageFlags.Ephemeral
    });
}

export async function GetJsonForSinglettachment(
    interaction: ChatInputCommandInteraction,
    name: string): Promise<string> {
    logger.debug({
        attachmentName: name,
        interactionId: interaction.id
    }, `Attempting to retrieve attachment '${name}' from interaction '${interaction.id}'`)

    const attachment = interaction.options.getAttachment(name, true);
    const card = await fetch(attachment.url);
    return await card.text();
}