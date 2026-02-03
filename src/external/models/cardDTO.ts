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