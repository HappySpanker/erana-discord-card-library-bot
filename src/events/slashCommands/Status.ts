import { CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ISlashCommandHandler } from "./interfaces/ICommandHandler.js";

export type StatusValue = {
    Erana: {
        Uptime: string
    },
    System: {
        Uptime: string,
        Hostname: string
    }
}

export const StatusSlashCommandBuilder =
    new SlashCommandBuilder()
        .setName("status")
        .setDescription("Show system status");

/**
 * The command handler for the "Status" slash command
 */
export class StatusSlashCommandHandler implements ISlashCommandHandler {
    public async handle(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply();

        // Get status from backend; for now...
        const statusValue: StatusValue = {
            Erana: {
                Uptime: "234 years"
            },
            System: {
                Uptime: "345 years",
                Hostname: "localhost"
            }
        }

        await interaction.editReply({
            embeds: [this.statusEmbedBuilder(statusValue)]
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