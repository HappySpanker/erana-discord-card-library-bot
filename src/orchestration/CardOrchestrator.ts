import { Temporal } from "@js-temporal/polyfill";
import { CardUploadRequest } from "./models/CardUploadRequest.js";
import { CardUploadResponse } from "./models/CardUploadResponse.js";
import { logger } from "../logger.js";

export interface ICardOrchestrator {
    Upload(request: CardUploadRequest): Promise<CardUploadResponse>
}

class CardOrchestrator implements ICardOrchestrator {
    async Upload(request: CardUploadRequest): Promise<CardUploadResponse> {
        logger.trace("CardOrchestrator.Upload");

        return {
            success: true,
            item: {
                CanonicalUserId: "1",
                Created: Temporal.Now.instant(),
                Name: "name",
                Tagline: request.Tagline,
                Updated: Temporal.Now.instant(),
                URL: "http:/invalid.invalid"
            }
        };
    }    
}

export function CreateCardOrchestrator(): ICardOrchestrator {
    return new CardOrchestrator()
}