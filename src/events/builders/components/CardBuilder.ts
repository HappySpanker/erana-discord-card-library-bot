import { SectionBuilder } from "discord.js";
import { CardUpdateModel, CardUploadModel } from "../../../orchestration/models/Common.js";

export function CardBuilder(cardModel: CardUpdateModel | CardUploadModel): SectionBuilder {
  const createdTimestamp = Math.floor(cardModel.Created.epochMilliseconds / 1000);
  const updateTimestamp = Math.floor(cardModel.Updated.epochMilliseconds / 1000);
  const tags = ["OC", "Female", "Elf", "Kemonomimi"]
    .map(t => `\`${t}\``)
    .join(", ");

  return new SectionBuilder()
    .addTextDisplayComponents(
      tdc => tdc.setContent(`## ${cardModel.Name}
-# by <@${cardModel.CanonicalUserId}>

> ${cardModel.Tagline}

${tags}
 
-# ID: 
-# Created: <t:${createdTimestamp}:R>
-# Updated: <t:${updateTimestamp}:R>`)
    )
    .setThumbnailAccessory(thumbnail =>
      thumbnail.setURL(cardModel.URL)
        .setDescription(cardModel.Tagline.substring(0, 64))
    )
}