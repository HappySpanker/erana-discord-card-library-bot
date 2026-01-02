import { IUploadMyCardsOrchestrator } from "./CardsOrchestrator.js";
import { logger } from "../logger.js";
import { TavernCardV2 } from "../Cards.js";
import { CardListResponse } from "./models/CardListResponse.js";
import { Pagination } from "./models/Pagination.js";
import { cardsService } from "../logic/CardService.js";
import { CardListItem } from "./models/CardListItem.js";

export interface IListCardsOrchestrator {
  listCards(pagination: Pagination, myUserId: string): Promise<CardListResponse>;
}

export class MyCardsOrchestrator implements
  IUploadMyCardsOrchestrator,
  IListCardsOrchestrator {

  async listCards(
    pagination: Pagination, 
    userId: string): Promise<CardListResponse> {
    logger.trace({
      pagination: pagination,
      userId: userId,
    }, "Orchestrating card listing");

    // Get the cards
    const cards = cardsService.ListCards();

    // Populate response
    const cardListResponse: CardListResponse = {
      Items: cards.map(container => {
        const cardListItem: CardListItem = {
          Name: "",
          Tagline: container.Tagline ?? "Tagline not set",
          UserId: userId,
          URL: "http://localhost/" + Math.random(),
          Created: container.Created,
          Updated: container.Updated,
        }
        if (container.IsV1()) {
          return Object.assign(cardListItem, { 
            Name: container.Card.name
          });
        } else if (container.IsV2() || container.IsV3()) {
          return Object.assign(cardListItem, { 
            Name: container.Card.data.name
          });
        }
        throw new Error("Could not determine card version");
      }),
      Pagination: false
    }

    return cardListResponse;
  }

  /**
   * Handle uploading JSON file
   */
  async uploadJson(json: unknown): Promise<boolean> {
    logger.debug({

    }, "uploadJson");

    const cardv2 = this.salvageCard(json);

    return await Promise.resolve(true);
  }

  /**
   * WIP; later concern
   */
  uploadCard(card: unknown): Promise<boolean> {
    throw new Error("Method not implemented.");
  }



  /**
   * This eventually has to go to the logic layer
   */
  private salvageCard(json: unknown): TavernCardV2 {

    return {
      spec: "chara_card_v2", // Placeholder value
      spec_version: "2.0", // Placeholder value
      data: {
        name: "", // Placeholder value
        description: "", // Placeholder value
        personality: "", // Placeholder value
        scenario: "", // Placeholder value
        first_mes: "", // Placeholder value
        mes_example: "", // Placeholder value
        creator_notes: "", // Placeholder value
        system_prompt: "", // Placeholder value
        post_history_instructions: "", // Placeholder value
        alternate_greetings: [], // Placeholder value
        tags: [], // Placeholder value
        creator: "", // Placeholder value
        character_version: "", // Placeholder value
        extensions: {} // Placeholder value
      }
    };

  }
}