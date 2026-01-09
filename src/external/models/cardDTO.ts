import { Temporal } from "@js-temporal/polyfill"
import { AnyTavernCard, CardContainer } from "../../Cards.js"

export type CardDTO = {
  id: number,
  user_id: string,
  tagline: string,
  card_json: AnyTavernCard,
  created: Temporal.Instant,
  updated: Temporal.Instant
}

export function CardDTOToCardContainer(dto: CardDTO): CardContainer {
  return new CardContainer(
    dto.card_json,
    dto.user_id,
    dto.created,
    dto.updated,
    dto.tagline
  )
}