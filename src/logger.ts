import { CacheType, ChatInputCommandInteraction } from "discord.js";
import pino from "pino";

export const logger = pino({
    level: process.env.LOG_LEVEL ?? "info",
    base: {
        service: "erana-discord-bot",
        env: process.env.NODE_ENV ?? "dev"
    },
    timestamp: pino.stdTimeFunctions.isoTime
});

export function slashCommandInteractionLogger(
    interaction: ChatInputCommandInteraction<CacheType>
) : pino.Logger {
    return logger.child({
        userId: interaction.user.id,
        username: interaction.user.username,
        guildId: interaction.guild?.id ?? "dm",
        guildName: interaction.guild?.name ?? "dm",
        commandName: interaction.commandName,
        interactionId: interaction.id
    });
}