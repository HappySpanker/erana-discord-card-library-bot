import { ICardService } from "../logic/CardService.js";
import { IUserService } from "../logic/UserService.js";
import { CardListResponse } from "./models/Card.js";
import { Pagination } from "./models/Common.js";

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
    throw new Error("Method in implemented");
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