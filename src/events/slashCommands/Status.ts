import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ISlashCommandHandler } from "./interfaces/ICommandHandler.js";

export const StatusSlashCommandBuilder =
    new SlashCommandBuilder()
        .setName("status")
        .setDescription("Show system status");

/**
 * The command handler for the "Status" slash command
 */
export class StatusSlashCommandHandler implements ISlashCommandHandler {
    async handle(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply();

        // TODO: get status here?

        await interaction.editReply("up!");
    }

}