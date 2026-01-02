import { CacheType, ChatInputCommandInteraction, EmbedBuilder, LabelBuilder, MessageFlags, ModalBuilder, TextDisplayBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { CardUpload } from "../modals/CardUpload.js";
import { logger } from "../../logger.js";
import { MyCardsOrchestrator } from "../../orchestration/CardsOrchestrator.Mine.js";

const myCardsOrchestrator = new MyCardsOrchestrator();

/**
 * Handles calls for listing one's own cards
 * @param interaction An interaction that has not been replied to yet
 */
export async function CardsMineList(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
  logger.trace({
    commandPath: "Cards:Mine:List",
    userId: interaction.user.id,
    targetUserId: interaction.user.id,
    interactionId: interaction.id,
  }, "Handling Cards:Mine:List");

  // Prepare intial call to orchestrator
  const cardsListResponse = await myCardsOrchestrator.listCards(
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

export async function CardsMineUpload(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
  logger.trace("Handling Cards:Mine:Upload");

  const modal = new ModalBuilder()
    .setCustomId(CardUpload.customId)
    .setTitle("Card upload");

  const cardNameExplanationText = new TextDisplayBuilder()
    .setContent("Please be aware that the name above will impact how Erana outputs your cards. The name will be output at the resulting file name, which is used by clients as the default character name.");

  const cardNameInput = new TextInputBuilder()
    .setCustomId('name')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Erana")
    .setRequired(true);

  const cardNameLabel = new LabelBuilder()
    .setLabel("What's the name of your card?")
    .setDescription("Will be used to output the resulting card JSON or PNG naming and thus by your preferred client.")
    .setTextInputComponent(cardNameInput);

  modal.addLabelComponents(cardNameLabel);
  modal.addTextDisplayComponents(cardNameExplanationText);

  // Show modal to the user
  await interaction.showModal(modal);
}