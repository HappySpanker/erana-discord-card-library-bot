import { Pool } from "pg";
import { logger } from "../logger.js";
import { database_pool } from "./Database.js";
import { CardDTO } from "./models/cardDTO.js";
import { subscribe } from "node:diagnostics_channel";

export interface ICardStore {
  ListByUser(userId: string): Promise<Array<CardDTO>>
  UploadCard(request: UploadCardRequest): Promise<void>
}

export type UploadCardRequest = {
  userId: number,
  visibility: number,
  tagline: string,
  json: string,
}

class CardStore implements ICardStore {

  constructor(
    private readonly _pool: Pool
  ) { }
  
  async UploadCard(request: UploadCardRequest): Promise<void> {
    logger.trace({
      userId: request.userId,
      visibility: request.visibility,
      tagline: request.tagline.substring(0, 32),
      json: request.json.substring(0, 32)
    },
    "CardStore.Upload");

    // Try to upload card
    try {
      await this._pool.query(`INSERT INTO public.cards(
	user_id, card_json, tagline, visibility)
	VALUES ($1, $2, $3, $4);`,
        [
          request.userId,
          request.json,
          request.tagline,
          request.visibility
        ]
      );
    } catch (err) {
      logger.error({
          userId: request.userId,
          visibility: request.visibility,
          tagline: request.tagline,
          json: request.json.substring(0, 32),
          err
        },
        "Error uploading card to database");

      throw err;
    }
  }
  
  /**
   * Lists all cards
   * @param userId The canonical user ID to list
   * @returns The cards belonging to that user
   */
  async ListByUser(userId: string): Promise<CardDTO[]> {
    logger.trace({
        userId
      },
      "CardStore.ListByUser")
    try {
      const res = await this._pool.query<CardDTO>(
        `
        SELECT 
          cards.id,
          cards.user_id::text AS user_id,
          cards.tagline,
          cards.card_json as card,
          cards.created,
          cards.updated
        FROM public.cards
        JOIN public.users ON cards.user_id = users.id
        WHERE 1=1
          AND users.discord_user_id = $1::bigint
        `,
        [ userId ]
      );

      return res.rows;
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

export function CreateCardStore(pool: Pool): ICardStore {
  return new CardStore(pool);
}