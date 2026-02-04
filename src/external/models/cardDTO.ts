import { Temporal } from "@js-temporal/polyfill"
import { TavernCardV2 } from "../../Cards.js"

/**
 * These field names MUST match the field names in the source query.
 * Node-PG is case-sensitive enough for this.
 */
export type CardDTO = {
  id: string,
  visibility: string,
  user_id: string,
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

export type UpdateCardDto = {
  Id: string,
  Visibility?: string,
  Tagline?: string,
  Card?: TavernCardV2
}