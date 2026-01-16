import { CardContainer, TavernCardV2, TavernCardV3 } from "../Cards.js";
import { logger } from "../logger.js";
import { cardStore } from "../external/CardStore.js";
import { IsTavernCardV3 } from "./schemas/TavernCardV3Schema.js";
import { IsTavernCardV2, TavernCardV2Schema } from "./schemas/TavernCardV2Schema.js";

export interface IListCardsService {
  ListCards(userId: string): Promise<Array<CardContainer>>;
}

export interface IUploadCardService {
  UploadCard(
    userId: string,
    visibility: string,
    tagline: string,
    json: string
  ): Promise<void>;
}

class CardsService implements 
  IListCardsService,
  IUploadCardService {
  async UploadCard(
    userId: string,
    visibility: string,
    tagline: string,
    json: string
  ): Promise<void> {
    logger.trace({
      UserId: userId,
      visibility: visibility,
      Tagline: tagline.substring(0, 32),
      Json: json.substring(0, 32)
    },
    "CardsService.UploadCard");

    const rawCard = JSON.parse(json);
    let card: TavernCardV2;

    if(IsTavernCardV3(rawCard)) {
      logger.debug("Trimming down ST TavernCardV3 instance to TavernCardV2");
      card = this.translateToTaverCardV2(rawCard);
    } else if (IsTavernCardV2(rawCard)) {
      card = rawCard;
    } else {
      throw new Error("Inbound JSON is not a TavernCardV2 nor ST TavernCardV3");
    }

    
  }

  async ListCards(userId: string): Promise<Array<CardContainer>> {
    logger.trace("CardsService.ListCards");

    // TODO: try cache first

    // Direct access
    const cardDTOs = await cardStore.ListByUser(userId);

    logger.trace({
        count: cardDTOs.length
      },
      "Received cardDTO[] from cardStore");

    return cardDTOs.map(dto => {
      return new CardContainer(
        dto.card as TavernCardV3,
        dto.visibility,
        dto.user_id,
        dto.created,
        dto.updated,
        dto.tagline
      )
    });
  }

  /**
   * While the ST V3 is a proper idea; it's verbose and there's no need to 
   * keep V1 backwards compatibility in store.
   * @param card The TavernV3Card to transform
   * @returns A true TavernCardV2
   */
  private translateToTaverCardV2(card: TavernCardV3): TavernCardV2 {
    return {
      spec: "chara_card_v2",
      spec_version: "2.0",
      data: { ...card.data }
    }
  }
}

export const cardsService = new CardsService();