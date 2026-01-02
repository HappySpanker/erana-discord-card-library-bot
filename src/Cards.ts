/**
 * Based on: https://github.com/malfoyslastname/character-card-spec-v2
 */

import { Temporal } from "@js-temporal/polyfill"
import { CharacterBook } from "./Characterbooks.js"
import { cardsService } from "./logic/CardService.js"

/**
 * Ancient V1 card spec
 */
export type TavernCardV1  = {
  spec: "chara_card_v1", // Not part of the spec, QOL addition
  spec_version: "1.0", // Not part of the spec, QOL addition
  name: string
  description: string
  personality: string
  scenario: string
  first_mes: string
  mes_example: string
}

/**
 * Ancient-but-still-common V2 card spec
 */
export type TavernCardV2 = {
  spec: 'chara_card_v2'
  spec_version: '2.0' // May 8th addition (refers to may 2023)
  data: {
    name: string
    description: string
    personality: string
    scenario: string
    first_mes: string
    mes_example: string

    // New fields start here
    creator_notes: string
    system_prompt: string
    post_history_instructions: string
    alternate_greetings: Array<string>
    character_book?: CharacterBook

    // May 8th additions (refers to may 2023)
    tags: Array<string>
    creator: string
    character_version: string
    extensions: Record<string, any>
  }
}

export type TavernCardV3 = {
  spec: 'chara_card_v3'
  spec_version: '3.0' // June 2024-ish

  name: string
  description: string
  personality: string
  scenario: string
  first_mes: string
  mes_example: string

  data: {
    name: string
    description: string
    personality: string
    scenario: string
    first_mes: string
    mes_example: string

    creator_notes: string
    system_prompt: string
    post_history_instructions: string
    alternate_greetings: Array<string>
    character_book?: CharacterBook

    tags: Array<string>
    creator: string
    character_version: string
    extensions: Record<string, any>
  }
}

export type AnyTavernCard = TavernCardV1 | TavernCardV2 | TavernCardV3;

/**
 * This is where the fun begin!
 * A container for all TavenCard specs. All supported versions.
 */
export class CardContainer<T extends AnyTavernCard = AnyTavernCard> {
  constructor(
    // Main data
    public  readonly Card: T,
    // Trackinbg
    public readonly UserId: string,
    public readonly Created: Temporal.Instant,
    public readonly Updated: Temporal.Instant,
    // Enrichments
    public readonly Tagline?: string
  ) {}

  public IsV1(): this is CardContainer<TavernCardV1> {
    return this.Card.spec_version === "1.0";
  }

  public IsV2(): this is CardContainer<TavernCardV2> {
    return this.Card.spec_version === "2.0";
  }

  public IsV3(): this is CardContainer<TavernCardV3> {
    return this.Card.spec_version === "3.0";
  }
}