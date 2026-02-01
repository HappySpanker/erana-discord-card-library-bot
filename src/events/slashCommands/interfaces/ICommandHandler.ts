import { ChatInputCommandInteraction } from "discord.js";

export interface ISlashCommandHandler {
    Identifier: string;
    Handle(interaction: ChatInputCommandInteraction): Promise<void>
}