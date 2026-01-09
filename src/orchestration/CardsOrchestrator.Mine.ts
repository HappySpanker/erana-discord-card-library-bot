import { IUploadMyCardsOrchestrator } from "./CardsOrchestrator.js";
import { logger } from "../logger.js";
import { CardContainer, TavernCardV2 } from "../Cards.js";
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

  /**
   * List cards for a user
   * @param pagination Should we use pagination and if so, where are we?
   * @param userId List the cards for which user?
   * @returns A list of cards for the requested user
   */
  async listCards(
    pagination: Pagination,
    userId: string): Promise<CardListResponse> {
    logger.trace({
      pagination: pagination,
      userId: userId,
    }, "Orchestrating card listing");

    // Get the cards
    const cards = await cardsService.ListCards(userId);

    // Populate and return the response
    return {
      Items: cards.map(this.cardContainerToCardListItem),
      Pagination: false // TODO: check where this should come from
    }
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

  private cardContainerToCardListItem(cardContainer: CardContainer): CardListItem {
    // Safe defaults for now
    return {
      Name: cardContainer.Card.data.name,
      Tagline: cardContainer.Tagline ?? "Tagline not set",
      UserId: cardContainer.UserId,
      URL: "http://localhost/" + Math.random(), // TODO: update me!
      Created: cardContainer.Created,
      Updated: cardContainer.Updated,
    };
  }
}