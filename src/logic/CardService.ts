import { CardContainer } from "../Cards.js";
import { logger } from "../logger.js";
import { ICardStore } from "../external/CardStore.js";
import { UploadInput, UploadOutput } from "./models/Card.js";
import { TranslateVisbilityStringToNumber, TranslateVisibilityNumberToString } from "./utils/Visbility.js";

export interface ICardService {
  ListCards(userId: string): Promise<Array<CardContainer>>;
  Upload(request: UploadInput): Promise<UploadOutput>;
}

class CardsService implements ICardService {
  constructor(
    private readonly _cardStore: ICardStore
  ) { }

  async Upload(request: UploadInput): Promise<UploadOutput> {
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
        visibility: TranslateVisbilityStringToNumber(request.Visibility)
      });

      return {
        Tagline: dto.tagline,
        UserId: Number(dto.user_id),
        Visibility: TranslateVisibilityNumberToString(dto.visibility),
        Card: dto.card,

      }
    } catch(err) {
      logger.error(err);
      throw err;
    }
  }

  async ListCards(userId: string): Promise<Array<CardContainer>> {
    logger.trace("CardsService.ListCards");

    // TODO: try cache first

    // Direct access
    const cardDTOs = await this._cardStore.ListByUser(userId);

    logger.trace({
        count: cardDTOs.length
      },
      "Received cardDTO[] from cardStore");

    return cardDTOs.map(dto => {
      return new CardContainer(
        dto.card,
        TranslateVisibilityNumberToString(dto.visibility),
        dto.user_id.toString(),
        dto.created,
        dto.updated,
        dto.tagline
      )
    });
  }
}

export function CreateCardService(cardStore: ICardStore): ICardService {
  return new CardsService(cardStore);
}