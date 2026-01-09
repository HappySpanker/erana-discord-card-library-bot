import { logger } from "../logger.js";
import { CardContainer, TavernCardV2 } from "../Cards.js";
import { CardListResponse } from "./models/CardListResponse.js";
import { Pagination } from "./models/Pagination.js";
import { cardsService } from "../logic/CardService.js";
import { CardModel } from "./models/CardModel.js";
import { CardUploadRequest } from "./models/CardUploadRequest.js";
import { CardUploadResponse } from "./models/CardUploadResponse.js";
import { Temporal } from "@js-temporal/polyfill";

export interface IListMyCardsOrchestrator {
  listCards(pagination: Pagination, myUserId: string): Promise<CardListResponse>;
}

export interface IUploadMyCardsOrchestrator {
    /**
     * Upload JSON data
     * @param json the raw JSON data a card
     */
    uploadJson(cardUploadModel: CardUploadRequest): Promise<CardUploadResponse>;
}

class MyCardsOrchestrator implements
  IUploadMyCardsOrchestrator,
  IListMyCardsOrchestrator {

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
  async uploadJson(cardUploadModel: CardUploadRequest): Promise<CardUploadResponse> {
    logger.trace("MyCardsOrchestrator.uploadJson");

    cardsService.UploadCard(
      cardUploadModel.UserId,
      cardUploadModel.Visibility,
      cardUploadModel.Tagline,
      cardUploadModel.Json
    );

    return await Promise.resolve({
      success: true,
      item: {
        Name: "???",
        Tagline: cardUploadModel.Tagline,
        URL: "xxx",
        UserId: "yyy",
        Created: Temporal.Now.instant(),
        Updated: Temporal.Now.instant(),
      }
    });
  }

  private cardContainerToCardListItem(cardContainer: CardContainer): CardModel {
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

export const myCardsOrchestrator = new MyCardsOrchestrator();