import { AnyTavernCard, CardContainer } from "../Cards.js";

export interface IListByUserCardStore {
  ListByUser(userId: string): Promise<Array<CardContainer>>
}

export interface IUploadByUserCardStore {
  UploadByUser(userId: string): Promise<boolean>
}

class CardStore implements
  IListByUserCardStore,
  IUploadByUserCardStore {
  
  UploadByUser(userId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  
  ListByUser(userId: string): Promise<Array<CardContainer>> {
    throw new Error("Method not implemented.");
  }
}

export const cardStore = new CardStore();