import { Temporal } from "@js-temporal/polyfill"
import { TavernCardV2 } from "../../Cards.js"

/**
 * These field names MUST match the field names in the source query.
 * Node-PG is case-sensitive enough for this.
 */
export type CardDTO = {
  id: number,
  visibility: string,
  user_id: number,
  tagline: string,
  card: TavernCardV2,
  created: Temporal.Instant,
  updated: Temporal.Instant
}

/**
 * This is for to-be uploaded cards; id, created and updated are not meant to
 * be handled by client uploads; so we omit these
 */
export type UploadCardDto = Omit<CardDTO, "id" | "created" | "updated">;

/**
 * This is for the to-be update cards; user_id, created and update are not meant 
 * to be handled by client updates; so we omit these
 */
export type UpdateCardDto = Omit<CardDTO, "user_id" | "created" | "updated">;