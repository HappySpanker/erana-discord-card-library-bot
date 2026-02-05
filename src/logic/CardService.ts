import { CardContainer, TavernCardV2 } from "../Cards.js";
import { logger } from "../logger.js";
import { ICardStore } from "../external/CardStore.js";
import { UpdateInput, UploadInput } from "./models/Card.js";
import { ConvertToCardContainerV2 } from "./utils/CardContainerUtils.js";
import { CardDTO } from "../external/models/cardDTO.js";
import { assertExists } from "../utils/Assertions.js";

export interface ICardService {
  ListCards(userId: string): Promise<CardContainer<TavernCardV2>[]>;
  Upload(request: Partial<CardContainer<TavernCardV2>>): Promise<CardContainer<TavernCardV2>>;
  Update(request: UpdateInput): Promise<CardContainer<TavernCardV2>>;
}

class CardsService implements ICardService {
  constructor(
    private readonly _cardStore: ICardStore
  ) { }

  async Upload(request: Partial<CardContainer<TavernCardV2>>): Promise<CardContainer<TavernCardV2>> {
    logger.trace("CardsService.Upload");

    // Upload
    try {
      assertExists(request.Card, "Card must be set");
      assertExists(request.Tagline, "Tagline must be set");
      assertExists(request.UserId, "UserId must be set");
      assertExists(request.Visibility, "Visibility must be set");

      const inputDTO: Partial<CardDTO> = {
        card: request.Card,
        tagline: request.Tagline,
        user_id: request.UserId,
        visibility: request.Visibility
      }

      const dto = await this._cardStore.Upload(inputDTO);

      return ConvertToCardContainerV2(dto);

    } catch(err) {
      logger.error(err);
      throw err;
    }
  }

  async Update(input: UpdateInput): Promise<CardContainer<TavernCardV2>> {
    logger.trace("CardsService.Update");

    // Upload
    try {
      const cardDTO: Partial<CardDTO> = {
        id: input.Id
      }

      if (input.Visibility) cardDTO.visibility = input.Visibility;
      if (input.Tagline) cardDTO.tagline = input.Tagline;
      if (input.Card) cardDTO.card = input.Card;

      const dto = await this._cardStore.Update(cardDTO);

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