import z from "zod";
import { TavernCardV2Schema } from "./TavernCardV2Schema.js";
import { TavernCardV3 } from "../../Cards.js";

export const TavernCardV3Schema = TavernCardV2Schema.extend({
  spec: z.literal('chara_card_v3'),
  spec_version: z.literal('3.0'),

  name: z.string(),
  description: z.string(),
  personality: z.string(),
  scenario: z.string(),
  first_mes: z.string(),
  mes_example: z.string(),
})

export function IsTavernCardV3(source: unknown): source is TavernCardV3 {
  return TavernCardV3Schema.safeParse(source).success;
}