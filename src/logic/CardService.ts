import { CardContainer, TavernCardV2 } from "../Cards.js";
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
    logger.trace({

    }, "Servicing card listing");

    // TODO: try cache first

    // Direct access
    return await cardStore.ListByUser(userId)
  }
}

// TODO: Remove me!
function dummyCardGenerator(): TavernCardV2 {
  return {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: {
      alternate_greetings: [],
      character_version: "dummy",
      creator: "dummy",
      creator_notes: "dummy",
      description: "dummy",
      extensions: {
        ["dummy"]: undefined
      },
      first_mes: "dummy",
      mes_example: "dummy",
      name: "dummy",
      personality: "dummy",
      post_history_instructions: "dummy",
      scenario: "dummy",
      system_prompt: "dummy",
      tags: ["dummy"]
    }
  }
}

export const cardsService = new CardsService();