import { CardContainer, TavernCardV2, TavernCardV3 } from "../Cards.js";
import { logger } from "../logger.js";
import { IsTavernCardV3 } from "./schemas/TavernCardV3Schema.js";
import { IsTavernCardV2 } from "./schemas/TavernCardV2Schema.js";
import { ICardStore, UploadCardRequest as externalUploadCardRequest } from "../external/CardStore.js";

export interface ICardService {
  ListCards(userId: string): Promise<Array<CardContainer>>;
  UploadCard(request: UploadCardRequest): Promise<CardContainer>;
}

export type UploadCardRequest = {
  userId: number,
  visibility: string,
  tagline: string,
  json: string
};

class CardsService implements ICardService {
  constructor(
    private readonly _cardStore: ICardStore
  ) { }

  async UploadCard(request: UploadCardRequest): Promise<CardContainer> {
    logger.trace({
      userId: request.userId,
      visibility: request.visibility,
      tagline: request.tagline.substring(0, 32),
      json: request.json.substring(0, 32)
    },
    "CardsService.UploadCard");

    // Parse
    const rawCard = JSON.parse(request.json);
    let card: TavernCardV2;

    // Validate
    if(IsTavernCardV3(rawCard)) {
      logger.debug("Trimming down ST TavernCardV3 instance to TavernCardV2");
      card = this.translateToTaverCardV2(rawCard);
    } else if (IsTavernCardV2(rawCard)) {
      card = rawCard;
    } else {
      throw new Error("Inbound JSON is not a TavernCardV2 nor ST TavernCardV3");
    }

    // Upload
    try {
      const result = await this._cardStore.UploadCard({
        userId: request.userId,
        card: card,
        tagline: request.tagline,
        visibility: this.translateVisbilityStringToNumber(request.visibility)
      });

      return new CardContainer(
        result.card,
        result.visibility,
        result.user_id,
        result.created,
        result.updated,
        result.tagline
      )
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

  private translateVisbilityStringToNumber(visbility: string): number {
    switch (visbility.toLowerCase()) {
      case "public": return 255;
      case "shared": return 32;
      case "listed": return 16;    
      case "private": return 0;
    }

    throw new Error(`Value '${visbility}' is an invalid visibility`);
  }
}

export function CreateCardService(cardStore: ICardStore): ICardService {
  return new CardsService(cardStore);
}