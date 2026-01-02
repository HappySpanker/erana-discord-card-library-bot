import { CacheType, ChatInputCommandInteraction, FileUploadBuilder, LabelBuilder, MessageFlags, ModalBuilder, SlashCommandBuilder, TextDisplayBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ISlashCommandHandler } from "./interfaces/ICommandHandler.js";
import { CardUpload } from "../modals/CardUpload.js";
import { logger } from "../../logger.js";
import { CardsMineList, CardsMineUpload } from "./Cards.Mine.js";

export const CardsSlashCommandBuilder = new SlashCommandBuilder()
  .setName("cards")
  .setDescription("Handle character cards")

  // User
  // .addSubcommandGroup(group =>
  //   group
  //     .setName("user")
  //     .setDescription("Cards owned by a Discord user")
  //     .addSubcommand(sub =>
  //       sub
  //         .setName("list")
  //         .setDescription("List cards for a user")
  //         .addUserOption(opt =>
  //           opt
  //             .setName("target")
  //             .setDescription("User whose cards to list")
  //             .setRequired(true)
  //         )
  //     )
  // )

  // Mine
  .addSubcommandGroup(grp =>
    grp
      .setName("mine")
      .setDescription("Cards owned by me")
      .addSubcommand(sub =>
        sub
          .setName("list")
          .setDescription("List my cards")
      )
      .addSubcommand(sub => 
        sub
          .setName("upload")
          .setDescription("Upload a new card")
      )
      .addSubcommand(sub => 
        sub
          .setName("update")
          .setDescription("Update a card")
      )
      .addSubcommand(sub => 
        sub
          .setName("delete")
          .setDescription("Delete a card")
      )
  )

export class CardsSlashCommandsHandler implements ISlashCommandHandler {
  public async handle(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    const commandPath = (interaction.options.getSubcommandGroup() 
      + ":" 
      + interaction.options.getSubcommand())
        .toLowerCase();

    switch (commandPath) {
      case "mine:list": return await CardsMineList(interaction);
      case "mine:upload": return await CardsMineUpload(interaction);
      default: throw new Error("No matching subcommands found");
    }
  }
}