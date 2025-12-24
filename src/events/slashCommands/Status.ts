import { CacheType, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import { ISlashCommandHandler } from "./interfaces/ICommandHandler.js";
import { StatusOrchestration, StatusValue } from "../../orchestration/StatusOrchestration.js";

export const StatusSlashCommandBuilder =
    new SlashCommandBuilder()
        .setName("status")
        .setDescription("Show system status");

/**
 * The command handler for the "Status" slash command
 */
export class StatusSlashCommandHandler implements ISlashCommandHandler {
    public async handle(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const statusValue = await new StatusOrchestration()
            .orchestrate();

        await interaction.editReply({
            embeds: [this.statusEmbedBuilder(statusValue)],
        })
    }

    private statusEmbedBuilder(statusValue: StatusValue): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle("Erana status")
            .setDescription("Operation status of Erana")
            .addFields({
                name: "🧝‍♀️ Erana",
                value: [
                    `Uptime: ${statusValue.Erana.Uptime}`
                ].join("\n"),
                inline: true
            })
            .addFields({
                name: "🖥️ System",
                value: [
                    `Uptime: ${statusValue.System.Uptime}`,
                    `Hostname: ${statusValue.System.Hostname}`
                ].join("\n"),
                inline: true
            })
            .setFooter({
                text: "woot!"
            })
    }

}