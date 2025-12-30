import { IUploadMyCardsOrchestrator } from "./CardsOrchestrator.js";
import { logger } from "../logger.js";
import { TavernCardV2 } from "./models/Cards.js";

export class MyCardsOrchestrator 
    implements IUploadMyCardsOrchestrator {

    /**
     * Handle uploading JSON file
     */
    async uploadJson(json: unknown): Promise<boolean> {
        logger.debug({

        }, "uploadJson");
        
        const cardv2 = this.salvageCard(json);

        return await Promise.resolve(true);
    }

    /**
     * WIP; later concern
     */
    uploadCard(card: unknown): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    /**
     * This eventually has to go to the logic layer
     */
    private salvageCard(json: unknown): TavernCardV2 {

        return {
            spec: "chara_card_v2", // Placeholder value
            spec_version: "2.0", // Placeholder value
            data: {
                name: "", // Placeholder value
                description: "", // Placeholder value
                personality: "", // Placeholder value
                scenario: "", // Placeholder value
                first_mes: "", // Placeholder value
                mes_example: "", // Placeholder value
                creator_notes: "", // Placeholder value
                system_prompt: "", // Placeholder value
                post_history_instructions: "", // Placeholder value
                alternate_greetings: [], // Placeholder value
                tags: [], // Placeholder value
                creator: "", // Placeholder value
                character_version: "", // Placeholder value
                extensions: {} // Placeholder value
            }
        };

    }
}