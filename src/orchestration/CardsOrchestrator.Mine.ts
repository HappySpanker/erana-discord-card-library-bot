import { IUploadMyCardsOrchestrator } from "./CardsOrchestrator.js";
import { logger } from "../logger.js";
import { TavernCardV2 } from "./models/Cards.js";
import { CardListItem } from "./models/CardListItem.js";
import { CardListResponse } from "./models/CardListResponse.js";

export interface IListMyCardsOrchestrator {
  listCards(): Promise<CardListResponse>;
}

export class MyCardsOrchestrator implements
  IUploadMyCardsOrchestrator,
  IListMyCardsOrchestrator {

  async listCards(): Promise<CardListResponse> {
    const cardListResponse: CardListResponse = {
      Items: [],
      Pagination: false
    }
    
    for (let index = 1; index <= 10; index++) {
      cardListResponse.Items.push({
        Name: `Sample #${index}`,
        Tagline: `This is the tagline for sample #${index}`,
        URL: `http://localhost/sample/${index}`,
        UserId: "12345"
      })
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