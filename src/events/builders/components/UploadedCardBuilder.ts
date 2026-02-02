import { ContainerBuilder } from "discord.js";
import { CardBuilder } from "./CardBuilder.js";
import { CardModel } from "../../../orchestration/models/Common.js";

export function UploadedCardBuilder(card: CardModel): ContainerBuilder {
  return new ContainerBuilder()
    .setAccentColor(0x10AA10)
    .addTextDisplayComponents(
      tdc => tdc.setContent(`Congratulations! Your card '${card.Name}' has been uploaded!`)
    )
    .addSeparatorComponents(sep => sep)
    .addSectionComponents(CardBuilder(card))
}