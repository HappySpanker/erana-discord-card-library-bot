import { ContainerBuilder } from "discord.js";
import { CardBuilder } from "./CardBuilder.js";
import { CardContext } from "../../../orchestration/models/CardContext.js";

export function UploadedCardBuilder(card: CardContext): ContainerBuilder {
  return new ContainerBuilder()
    .setAccentColor(0x10AA10)
    .addTextDisplayComponents(
      tdc => tdc.setContent(`Congratulations! Your card '${card.Name}' has been uploaded!`)
    )
    .addSeparatorComponents(sep => sep)
    .addSectionComponents(CardBuilder(card))
}