import { CardContainer } from "../Cards.js";

export interface IUploadMyCardsOrchestrator {
    /**
     * Upload JSON data
     * @param json the raw JSON data a card
     */
    uploadJson(json: unknown): Promise<boolean>;

    /**
     * Upload PNG data
     * @param card the PNG containing a card
     */
    uploadCard(card: unknown): Promise<boolean>;
}

