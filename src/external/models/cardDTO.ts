import { Temporal } from "@js-temporal/polyfill"
import { AnyTavernCard, CardContainer } from "../../Cards.js"

export type CardDTO = {
  Id: number,
  Visibility: string,
  User_id: string,
  Tagline: string,
  Card_json: AnyTavernCard,
  Created: Temporal.Instant,
  Updated: Temporal.Instant
}

export function CardDTOToCardContainer(dto: CardDTO): CardContainer {
  return new CardContainer(
    dto.Card_json,
    dto.User_id,
    dto.Visibility,
    dto.Created,
    dto.Updated,
    dto.Tagline
  )
}