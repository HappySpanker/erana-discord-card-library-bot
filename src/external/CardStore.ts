import { Pool } from "pg";
import { logger } from "../logger.js";
import { database_pool } from "./Database.js";
import { CardDTO } from "./models/cardDTO.js";
import { subscribe } from "node:diagnostics_channel";
import { AnyTavernCard, TavernCardV2 } from "../Cards.js";

export interface ICardStore {
  ListByUser(userId: string): Promise<Array<CardDTO>>
  UploadCard(request: UploadCardRequest): Promise<CardDTO>
}

export type UploadCardRequest = {
  userId: number,
  visibility: number,
  tagline: string,
  card: TavernCardV2
}

class CardStore implements ICardStore {

  constructor(
    private readonly _pool: Pool
  ) { }
  
  async UploadCard(request: UploadCardRequest): Promise<CardDTO> {
    logger.trace({
      userId: request.userId,
      visibility: request.visibility,
      tagline: request.tagline.substring(0, 32),
    },
    "CardStore.Upload");

    // Try to upload card
    try {
      const result = await this._pool.query<CardDTO>(`INSERT INTO public.cards(
	user_id, card, tagline, visibility)
	VALUES ($1, $2, $3, $4) RETURNING *;`,
        [
          request.userId,
          request.card,
          request.tagline,
          request.visibility
        ]
      );

      return result.rows[0]!;
    } catch (err) {
      logger.error({
          userId: request.userId,
          visibility: request.visibility,
          tagline: request.tagline,
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
          cards.card,
          cards.created,
          cards.updated
        FROM public.cards
        JOIN public.users ON cards.user_id = users.id
        WHERE 1=1
          AND users.canonical_user_id = $1::bigint
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