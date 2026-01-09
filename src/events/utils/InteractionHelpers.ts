import { InteractionResponse, MessageFlags, RepliableInteraction } from "discord.js";

export async function EphemeralReply(interaction: RepliableInteraction, message: string): Promise<InteractionResponse<boolean>> {
    return await interaction.reply({
        content: message,
        flags: MessageFlags.Ephemeral
    });
}