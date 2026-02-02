import { Temporal } from "@js-temporal/polyfill";
import { logger } from "../logger.js";
import { CardUpdateRequest, CardUpdateResponse, CardUploadRequest, CardUploadResponse } from "./models/Card.js";

export interface ICardOrchestrator {
    Upload(request: CardUploadRequest): Promise<CardUploadResponse>
    Update(request: CardUpdateRequest): Promise<CardUpdateResponse>
}

class CardOrchestrator implements ICardOrchestrator {
    async Upload(request: CardUploadRequest): Promise<CardUploadResponse> {
        logger.trace("CardOrchestrator.Upload");
        
        return {
            Success: true,
            Result: {
                CanonicalUserId: "1",
                Created: Temporal.Now.instant(),
                Name: "name",
                Tagline: request.Tagline,
                Updated: Temporal.Now.instant(),
                URL: "http:/invalid.invalid"
            }
        };
    }

    async Update(request: CardUpdateRequest): Promise<CardUpdateResponse> {
        logger.trace("CardOrchestrator.Update");
        
        return {
            Success: true,
            Result: {
                CanonicalUserId: "1",
                Created: Temporal.Now.instant(),
                Name: "name",
                Tagline: request.Tagline || "Sample tagline",
                Updated: Temporal.Now.instant(),
                URL: "http:/invalid.invalid"
            }
        }
    }
}

export function CreateCardOrchestrator(): ICardOrchestrator {
    return new CardOrchestrator()
}