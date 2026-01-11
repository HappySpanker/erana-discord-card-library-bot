import z from "zod";
import { TavernCardV2Schema } from "./TavernCardV2Schema.js";

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