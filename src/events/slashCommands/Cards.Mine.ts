import { CacheType, ChatInputCommandInteraction, LabelBuilder, ModalBuilder, TextDisplayBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { CardUpload } from "../modals/CardUpload.js";
import { logger } from "../../logger.js";

/**
 * Handles calls for listing one's own cards
 * @param interaction An interaction that has not been replied to yet
 */
export async function CardsMineList(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
  logger.trace("Handling Cards:Mine:List");

  interaction.reply("Bye bye!");
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