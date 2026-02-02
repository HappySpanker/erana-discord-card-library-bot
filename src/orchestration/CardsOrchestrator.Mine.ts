import { logger } from "../logger.js";
import { CardContainer } from "../Cards.js";
import { ICardService } from "../logic/CardService.js";
import { IUserService } from "../logic/UserService.js";
import { CardListResponse, CardUploadRequest, CardUploadResponse } from "./models/Card.js";
import { CardListModel, Pagination } from "./models/Common.js";

export interface IMyCardsOrchestrator {
  ListCards(pagination: Pagination, canonicalUserId: string): Promise<CardListResponse>;
}

class MyCardsOrchestrator implements IMyCardsOrchestrator {

  constructor(
    private readonly _cardService: ICardService,
    private readonly _userService: IUserService,
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
      Success: true,
      Items: cards.map(this.cardContainerToCardListItem),
      Pagination: false // TODO: check where this should come from
    }
  }

  private cardContainerToCardListItem(cardContainer: CardContainer): CardListModel {
    // Safe defaults for now
    return {
      Name: cardContainer.Card.data.name,
      Tagline: cardContainer.Tagline ?? "Tagline not set",
      CanonicalUserId: cardContainer.UserId,
      URL: "http://localhost/" + Math.random(), // TODO: update me!
      Created: cardContainer.Created,
      Updated: cardContainer.Updated,
    };
  }
}

export function CreateMyCardOrchestrator(
  cardService: ICardService,
  userService: IUserService): IMyCardsOrchestrator {
  return new MyCardsOrchestrator(
    cardService,
    userService
  );
}