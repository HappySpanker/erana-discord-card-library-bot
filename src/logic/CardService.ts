import { CardContainer, TavernCardV2 } from "../Cards.js";
import { logger } from "../logger.js";
import { ICardStore } from "../external/CardStore.js";
import { UpdateInput, UploadInput } from "./models/Card.js";
import { ConvertToCardContainerV2 } from "./utils/CardContainerUtils.js";

export interface ICardService {
  ListCards(userId: string): Promise<CardContainer<TavernCardV2>[]>;
  Upload(request: UploadInput): Promise<CardContainer<TavernCardV2>>;
  Update(request: UpdateInput): Promise<CardContainer<TavernCardV2>>;
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
    "CardsService.Upload");

    // Upload
    try {
      const dto = await this._cardStore.Upload({
        user_id: request.UserId,
        card: request.Card,
        tagline: request.Tagline,
        visibility: request.Visibility
      });

      return ConvertToCardContainerV2(dto);

    } catch(err) {
      logger.error(err);
      throw err;
    }
  }

  async Update(request: UpdateInput): Promise<CardContainer<TavernCardV2>> {
    logger.trace({
      Id: request.Id,
      Visibility: request.Visibility,
      Tagline: request.Tagline.substring(0, 32)
    },
    "CardsService.Update");

    if (!request.IsV2()) {
      const msg = "Card to be updated is not V2";
      logger.error({
          Id: request.Id,
          actual_spec: request.Card.spec,
          actual_spec_version: request.Card.spec_version,
        },
        msg);
      throw new Error(msg);
    }

    // Upload
    try {
      const dto = await this._cardStore.Upload({
        id: request.Id,
        card: request.Card,
        tagline: request.Tagline,
        visibility: request.Visibility
      });

      return ConvertToCardContainerV2(dto);

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

    return cardDTOs.map(dto => ConvertToCardContainerV2(dto));
  }
}

export function CreateCardService(cardStore: ICardStore): ICardService {
  return new CardsService(cardStore);
}