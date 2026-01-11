import z from "zod";

export const TavernCardV2Schema = z.object({
    spec: z.literal("chara_card_v2"),
    spec_version: z.literal("2.0"),
    data: z.object({
        name: z.string(),
        description: z.string(),
        personality: z.string(),
        scenario: z.string(),
        first_mes: z.string(),
        mes_example: z.string(),

        // New fields start here
        creator_notes: z.string(),
        system_prompt: z.string(),
        post_history_instructions: z.string(),
        alternate_greetings: z.array(z.string()),
        //character_book?: CharacterBook // TODO

        // May 8th additions (refers to may 2023)
        tags: z.array(z.string()),
        creator: z.string(),
        character_version: z.string(),
        extensions: z.record(z.string(), z.any())
    })
})