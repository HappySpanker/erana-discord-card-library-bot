import { logger } from "../logger.js";
import { CardContainer } from "../Cards.js";
import { CardListResponse } from "./models/CardListResponse.js";
import { Pagination } from "./models/Pagination.js";
import { ICardService } from "../logic/CardService.js";
import { CardModel } from "./models/CardModel.js";
import { CardUploadRequest } from "./models/CardUploadRequest.js";
import { CardUploadResponse } from "./models/CardUploadResponse.js";
import { Temporal } from "@js-temporal/polyfill";

export interface IMyCardsOrchestrator {
  ListCards(pagination: Pagination, canonicalUserId: string): Promise<CardListResponse>;
  UploadJson(cardUploadModel: CardUploadRequest): Promise<CardUploadResponse>;
}

class MyCardsOrchestrator implements IMyCardsOrchestrator {

  constructor(
    private readonly _cardService: ICardService
  ){ }

  /**
   * List cards for a user
   * @param pagination Should we use pagination and if so, where are we?
   * @param canonicalUserId List the cards for which user?
   * @returns A list of cards for the requested user
   */
  async ListCards(
    pagination: Pagination,
    canonicalUserId: string): Promise<CardListResponse> {
    logger.trace({
      pagination: pagination,
      userId: canonicalUserId,
    }, "MyCardsOrchestrator.ListCards");

    // Get the cards
    const cards = await this._cardService.ListCards(canonicalUserId);

    // Populate and return the response
    return {
      Items: cards.map(this.cardContainerToCardListItem),
      Pagination: false // TODO: check where this should come from
    }
  }

  /**
   * Handle uploading JSON file
   */
  async UploadJson(cardUploadModel: CardUploadRequest): Promise<CardUploadResponse> {
    logger.trace("MyCardsOrchestrator.uploadJson");

    this._cardService.UploadCard(
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

export function CreateMyCardOrchestrator(cardService: ICardService): IMyCardsOrchestrator {
  return new MyCardsOrchestrator(cardService);
}