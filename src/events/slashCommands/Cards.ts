import { SlashCommandBuilder } from "discord.js";

export const CardsSlashCommandBuilder = new SlashCommandBuilder()
  .setName("cards")
  .setDescription("Handle character cards")
  .addSubcommandGroup(group =>
    group
      .setName("user")
      .setDescription("Cards owned by a Discord user")
      .addSubcommand(sub =>
        sub
          .setName("list")
          .setDescription("List cards for a user")
          .addUserOption(opt =>
            opt
              .setName("target")
              .setDescription("User whose cards to list")
              .setRequired(true)
          )
          .addStringOption(opt =>
            opt
              .setName("search")
              .setDescription("Search by name, tagline, tags and creator notes")
              .setRequired(false)
          )
      )
  )
  .addSubcommandGroup(grp =>
    grp
      .setName("mine")
      .setDescription("Cards owned by me")
      .addSubcommand(sub =>
        sub
          .setName("list")
          .setDescription("List my cards")
      )
  )
