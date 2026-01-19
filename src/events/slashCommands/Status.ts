import { CacheType, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import { ISlashCommandHandler } from "./interfaces/ICommandHandler.js";
import { StatusValue } from "../../orchestration/StatusOrchestration.js";
import { IOrchestration } from "../../orchestration/interfaces/IOrchestration.js";

export const StatusSlashCommandBuilder =
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Show system status");

/**
 * The command handler for the "Status" slash command
 */
export class StatusSlashCommandHandler implements ISlashCommandHandler {
  static Identifier = "status";
  
  constructor(
    private readonly _statusOrchestrator: IOrchestration<void, StatusValue>
  ) { }

  public async handle(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    });

    const statusValue = await this._statusOrchestrator
      .orchestrate();

    await interaction.editReply({
      embeds: [this.statusEmbedBuilder(statusValue)],
    })
  }

  private statusEmbedBuilder(statusValue: StatusValue): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle("Erana status")
      .addFields({
        name: "🧝‍♀️ Erana",
        value: [
          `__Uptime__: *${statusValue.Erana.Uptime || "Error"}*`
        ].join("\n"),
      })
      .addFields({
        name: "🖥️ System",
        value: [
          `__Uptime__: *${statusValue.System.Uptime || "Error"}*`,
          `__Hostname__: *${statusValue.System.Hostname || "Error"}*`
        ].join("\n"),
      })
      .addFields({
        name: "🧰 Services",
        value: [
          "__Cache__: ❌ **DOWN** *(redis)*",
          "__Store__: ✅ **UP** *(postgresql)*",
        ].join("\n")
      })
  }

}