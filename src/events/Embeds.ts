import { EmbedBuilder } from "discord.js";

/**
 * Makes an embed for usage as string error display
 * @param err The error string to display
 * @returns An EmbedBuilder
 */
export function GenericErrorEmbed(err?: string): EmbedBuilder {
    return new EmbedBuilder()
        .setColor("Red")
        .setTitle("An error occured")
        .setDescription(err || "No details given");
}

/**
 * Makes an embed for usage as exception display
 * @param err The exception to display
 * @returns An EmbedBuilder
 */
export function GenericExceptionEmbed(err: Error): EmbedBuilder {
    return new EmbedBuilder()
        .setColor("Red")
        .setTitle(err.name)
        .setDescription(err.message || "No details given");
}