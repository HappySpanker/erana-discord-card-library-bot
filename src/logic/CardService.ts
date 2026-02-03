import { CardContainer, TavernCardV2 } from "../Cards.js";
import { logger } from "../logger.js";
import { ICardStore } from "../external/CardStore.js";
import { UploadInput } from "./models/Card.js";
import { TranslateVisbilityStringToNumber, TranslateVisibilityNumberToString } from "./utils/Visbility.js";

export interface ICardService {
  ListCards(userId: string): Promise<CardContainer<TavernCardV2>[]>;
  Upload(request: UploadInput): Promise<CardContainer<TavernCardV2>>;
}

class CardsService implements ICardService {
  constructor(
    private readonly _cardStore: ICardStore
  ) { }

  async Upload(request: UploadInput): Promise<CardContainer<TavernCardV2>> {
    logger.trace({
      UserId: request.UserId,
      Visibility: request.Visibility,
      Tagline: request.Tagline.substring(0, 32)
    },
    "CardsService.UploadCard");

    // Upload
    try {
      const dto = await this._cardStore.UploadCard({
        user_id: request.UserId,
        card: request.Card,
        tagline: request.Tagline,
        visibility: request.Visibility
      });

      return new CardContainer<TavernCardV2>(
        dto.card,
        dto.visibility,
        dto.tagline,
        dto.user_id,
        dto.created,
        dto.updated,
      )

    } catch(err) {
      logger.error(err);
      throw err;
    }
  }

  async ListCards(userId: string): Promise<CardContainer<TavernCardV2>[]> {
    logger.trace("CardsService.ListCards");

    // TODO: try cache first

    // Direct access
    const cardDTOs = await this._cardStore.ListByUser(userId);

    logger.trace({
        count: cardDTOs.length
      },
      "Received cardDTO[] from cardStore");

    return cardDTOs.map(dto => {
      return new CardContainer<TavernCardV2>(
        dto.card,
        dto.visibility,
        dto.tagline,
        dto.user_id,
        dto.created,
        dto.updated
      )
    });
  }
}

export function CreateCardService(cardStore: ICardStore): ICardService {
  return new CardsService(cardStore);
}