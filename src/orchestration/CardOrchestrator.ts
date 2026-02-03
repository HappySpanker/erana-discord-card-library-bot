import { Temporal } from "@js-temporal/polyfill";
import { logger } from "../logger.js";
import { CardUpdateRequest, CardUpdateResponse, CardUploadRequest, CardUploadResponse } from "./models/Card.js";
import { ICardService } from "../logic/CardService.js";
import { IUserService } from "../logic/UserService.js";
import { TavernCardV2 } from "../Cards.js";
import { ITavernCardService } from "../logic/TavernCardService.js";

export interface ICardOrchestrator {
    Upload(request: CardUploadRequest): Promise<CardUploadResponse>
    Update(request: CardUpdateRequest): Promise<CardUpdateResponse>
}

class CardOrchestrator implements ICardOrchestrator {
    constructor(
        private readonly cardService: ICardService,
        private readonly userService: IUserService,
        private readonly tavernCardService: ITavernCardService
    ) { }

    async Upload(request: CardUploadRequest): Promise<CardUploadResponse> {
        logger.trace("CardOrchestrator.Upload");

        try {
            // Get logical user ID from canonical user ID
            const userId = await this.userService.GetUserModelByCanonicalUserId(request.CanonicalUserId);
    
            const card = this.tavernCardService.Parse(request.Json);
    
            const cardV2 = this.tavernCardService.CastToV2(card);
    
            const output = await this.cardService.Upload({
                Tagline: request.Tagline,
                UserId: userId.user_id,
                Visibility: request.Visibility,
                Card: cardV2
            })
    
            return {
                Result: {
                    CanonicalUserId: request.CanonicalUserId,
                    Name: output.Card.data.name,
                    Tagline: output.Tagline,
                    URL: "http:/invalid.invalid",
                    Created: output.Created,
                    Updated: output.Updated
                }
            };
        } catch (err) {
            logger.error({
                err,
                CanonicalUserId: request.CanonicalUserId
            }, "Failed to orchestrate upload");
            throw err;
        }
    }

    async Update(request: CardUpdateRequest): Promise<CardUpdateResponse> {
        logger.trace("CardOrchestrator.Update");

        return {
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

export function CreateCardOrchestrator(
    cardService: ICardService, 
    userService: IUserService, 
    tavernCardService: ITavernCardService): ICardOrchestrator {
    return new CardOrchestrator(
        cardService,
        userService,
        tavernCardService
    )
}