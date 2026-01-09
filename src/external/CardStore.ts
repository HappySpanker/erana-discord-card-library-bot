import { Temporal } from "@js-temporal/polyfill";
import { AnyTavernCard, CardContainer, TavernCardV1 } from "../Cards.js";
import { logger } from "../logger.js";
import { database_pool } from "./Database.js";

export interface IListByUserCardStore {
  ListByUser(userId: string): Promise<Array<CardContainer>>
}

export interface IUploadByUserCardStore {
  UploadByUser(userId: string): Promise<boolean>
}

// TODO: This should go elsewhere
export type CardDTO = {
  id: number,
  user_id: string,
  tagline: string,
  card_json: AnyTavernCard,
  created: Temporal.Instant,
  updated: Temporal.Instant
}

class CardStore implements
  IListByUserCardStore,
  IUploadByUserCardStore {

  private _pool = database_pool;
  
  UploadByUser(userId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  
  /**
   * Lists all cards
   * @param userId The canonical user ID to list
   * @returns The cards belonging to that user
   */
  async ListByUser(userId: string): Promise<CardContainer[]> {
    logger.trace({
        userId
      },
      "External card listing")
    try {
      const res = await this._pool.query<CardDTO>(
        `
        SELECT 
          cards.id,
          cards.user_id::text AS user_id,
          cards.tagline,
          cards.card_json,
          cards.created,
          cards.updated
        FROM public.cards
        JOIN public.users ON cards.user_id = users.id
        WHERE 1=1
          AND users.discord_user_id = $1::bigint
        `,
        [ userId ]
      );

      return res.rows.map(dto =>
        new CardContainer(
          dto.card_json,
          dto.user_id,
          dto.created,
          dto.updated,
          dto.tagline
        )
      )
    } catch (err) {
      logger.error({
        err,
        userId
        },
        "Call to ListByUser failed"
      );

      throw err;
    }
  }
}

export const cardStore = new CardStore();