import { CacheType, ChatInputCommandInteraction } from "discord.js";

export interface ISlashCommandHandler {
    handle(interaction: ChatInputCommandInteraction<CacheType>): Promise<void>
}