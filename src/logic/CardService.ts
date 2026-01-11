import { CardContainer, TavernCardV2, TavernCardV3 } from "../Cards.js";
import { logger } from "../logger.js";
import { cardStore } from "../external/CardStore.js";

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
}

export const cardsService = new CardsService();