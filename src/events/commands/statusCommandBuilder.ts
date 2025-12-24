import { SlashCommandBuilder } from "discord.js";

export const statusCommandBuilder =
    new SlashCommandBuilder()
        .setName("status")
        .setDescription("Show system status");