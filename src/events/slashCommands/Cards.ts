import { CacheType, ChatInputCommandInteraction, FileUploadBuilder, LabelBuilder, MessageFlags, ModalBuilder, SlashCommandBuilder, TextDisplayBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ISlashCommandHandler } from "./interfaces/ICommandHandler.js";
import { IMyCardsSubhandler } from "./cards/MyCardsSubhandler.js";

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

export const CardSlashCommandBuilder = new SlashCommandBuilder()
  .setName("card")
  .setDescription("Handles singlle card actions")
  .addSubcommand(sub => sub
    .setName("upload")
    .setDescription("Handled uploaded a new card")
    .addStringOption(opt => opt
      .setName("visibility")
      .setDescription("What should the visibility of your card be?")
      .setRequired(true)
      .addChoices([
        { name: "Private", value: "private" },
        { name: "Shared", value: "shared" },
        { name: "Public", value: "listed" },
        { name: "public", value: "public" },
      ])
    )
    .addStringOption(opt => opt
      .setName("tagline")
      .setRequired(true)
      .setDescription("A tagline that will really sell your card!")
    )
    .addAttachmentOption(opt => opt
      .setName("card")
      .setRequired(true)
      .setDescription("The card (either PNG or JSON) to upload")
    )
  )

export class CardsSlashCommandsHandler implements ISlashCommandHandler {
  static Identifier = "cards"

  constructor(
    private readonly _myCards: IMyCardsSubhandler
  ) { }

  public async Handle(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    const commandPath = (interaction.options.getSubcommandGroup() 
      + ":" 
      + interaction.options.getSubcommand())
        .toLowerCase();

    switch (commandPath) {
      case "mine:list": return await this._myCards.List(interaction);
      case "mine:upload": return await this._myCards.Upload(interaction);
      default: throw new Error("No matching subcommands found");
    }
  }
}