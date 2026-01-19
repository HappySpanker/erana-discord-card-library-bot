import { ChatInputCommandInteraction, EmbedBuilder, FileUploadBuilder, LabelBuilder, MessageFlags, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { CardUpload } from "../../modals/CardUpload.js";
import { logger } from "../../../logger.js";
import { IMyCardsOrchestrator } from "../../../orchestration/CardsOrchestrator.Mine.js";

export interface IMyCardsSubhandler {
  List(interaction: ChatInputCommandInteraction): Promise<void>;
  Upload(interaction: ChatInputCommandInteraction): Promise<void>;
}

class MyCardSubhandler implements IMyCardsSubhandler {
  constructor(
    private readonly _myCardsOrchestrator: IMyCardsOrchestrator
  ) { }

  async List(interaction: ChatInputCommandInteraction): Promise<void> {
    logger.trace({
      commandPath: "Cards:Mine:List",
      userId: interaction.user.id,
      targetUserId: interaction.user.id,
      interactionId: interaction.id,
    }, "MyCards.List");

    // Prepare intial call to orchestrator
    const cardsListResponse = await this._myCardsOrchestrator.ListCards(
      false,
      interaction.user.id
    );

    const embeds: Array<EmbedBuilder> = [];

    for (let card of cardsListResponse.Items) {
      embeds.push(new EmbedBuilder()
        .setTitle(card.Name)
        .setDescription(card.Tagline)
        .setURL(card.URL)
        .setFooter({
          text: `Created: ${card.Created.toLocaleString(interaction.locale)}, updated: ${card.Updated.toLocaleString(interaction.locale)}`
        }));
    }

    const pagination = false;
    let msg: string = "";

    if (!pagination) {
      msg = `Found a total of ${cardsListResponse.Items.length} card(s) belonging to you.`
    } else {
      msg = "Paginated reply"
    }

    await interaction.reply({
      content: msg,
      embeds: embeds,
      flags: [
        MessageFlags.Ephemeral
      ]
    });
  }

  async Upload(interaction: ChatInputCommandInteraction): Promise<void> {
    logger.trace("Handling Cards:Mine:Upload");

    const modal = new ModalBuilder()
      .setCustomId(CardUpload.Identifier)
      .setTitle("Card upload");

    // const cardNameExplanationText = new TextDisplayBuilder()
    //   .setContent("Please be aware that the name above will impact how Erana outputs your cards. The name will be output at the resulting file name, which is used by clients as the default character name.");

    // Visibility
    const setVisibilitySelector = new StringSelectMenuBuilder()
      .setCustomId('visibility')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Public")
          .setValue("public")
          .setDescription("This card will be marked as public")
      )
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Private")
          .setValue("private")
          .setDefault(true)
      )
      .setRequired(true);

    const setVisibilityLabel = new LabelBuilder()
      .setLabel("What is the visibility of your card?")
      .setDescription("Will be used to set the visibility of your card. This can always be changed later.")
      .setStringSelectMenuComponent(setVisibilitySelector);

    // Card
    const cardFileUpload = new FileUploadBuilder()
      .setCustomId("card")
      .setRequired(true);

    const cardFileUploadLabel = new LabelBuilder()
      .setLabel("The JSON representing your card.")
      .setFileUploadComponent(cardFileUpload);

    // Tagline
    const setTaglineTextInput = new TextInputBuilder()
      .setCustomId("tagline")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Your amazing tag line that will sell your card!")
      .setRequired(false);

    const setTaglineLabel = new LabelBuilder()
      .setLabel("What's your card's tagline?")
      .setTextInputComponent(setTaglineTextInput);

    modal.addLabelComponents(setVisibilityLabel);
    modal.addLabelComponents(setTaglineLabel);
    modal.addLabelComponents(cardFileUploadLabel);

    // Show modal to the user
    await interaction.showModal(modal);
  }
}

export function CreateMyCardsSubhandler(myCardsOrchestrator: IMyCardsOrchestrator): IMyCardsSubhandler {
  return new MyCardSubhandler(myCardsOrchestrator);
}