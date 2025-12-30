/**
 * Based on: https://github.com/malfoyslastname/character-card-spec-v2
 */

import { Temporal } from "@js-temporal/polyfill"
import { CharacterBook } from "./Characterbooks.js"

/**
 * Ancient V1 card spec
 */
export type TavernCardV1  = {
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

/**
 * This is where the fun begin!
 * A container for TavenCard specs. All supported versions.
 */
export type CardContainer = {
  userId: string,
  card: TavernCardV1 | TavernCardV2 | TavernCardV3,
  created: Temporal.Instant,
  updated: Temporal.Instant,
}