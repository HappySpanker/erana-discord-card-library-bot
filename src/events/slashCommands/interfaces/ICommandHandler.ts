import { CacheType, ChatInputCommandInteraction } from "discord.js";

export interface ISlashCommandHandler {
    Handle(interaction: ChatInputCommandInteraction<CacheType>): Promise<void>
}