import { stringify } from "node:querystring";
import { CardContainer, TavernCardV2 } from "../Cards.js";
import { logger } from "../logger.js";
import { Card } from "./models/Cards.js";
import { Temporal } from "@js-temporal/polyfill";

export interface IListCardsService {
  ListCards(): Array<CardContainer>;
}

class CardsService
  implements IListCardsService {
  ListCards(): Array<CardContainer> {
    logger.trace({

    }, "Servicing card listing");

    const collection: Array<CardContainer> = [];

    for (let index = 1; index <= 10; index++) {
      collection.push(new CardContainer(
        dummyCardGenerator(),
        "12345",
        Temporal.Now.instant(),
        Temporal.Now.instant(),
        "This is my tagline!"
      ));
    }

    return collection;
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