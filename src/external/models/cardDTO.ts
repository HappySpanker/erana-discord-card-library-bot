import { Temporal } from "@js-temporal/polyfill"

/**
 * These field names MUST match the field names in the source query.
 * Node-PG is case-sensitive enough for this.
 */
export type CardDTO = {
  id: number,
  visibility: string,
  user_id: string,
  tagline: string,
  card: unknown,
  created: Temporal.Instant,
  updated: Temporal.Instant
}