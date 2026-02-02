import { ContainerBuilder } from "discord.js";
import { CardBuilder } from "./CardBuilder.js";
import { CardUpdateModel, CardUploadModel } from "../../../orchestration/models/Common.js";

export function UploadedCardBuilder(card: CardUpdateModel | CardUploadModel): ContainerBuilder {
  return new ContainerBuilder()
    .setAccentColor(0x10AA10)
    .addTextDisplayComponents(
      tdc => tdc.setContent(`Congratulations! Your card '${card.Name}' has been uploaded!`)
    )
    .addSeparatorComponents(sep => sep)
    .addSectionComponents(CardBuilder(card))
}