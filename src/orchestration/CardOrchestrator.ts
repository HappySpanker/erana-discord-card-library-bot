import { Temporal } from "@js-temporal/polyfill";
import { logger } from "../logger.js";
import { CardUpdateRequest, CardUpdateResponse, CardUploadRequest, CardUploadResponse } from "./models/Card.js";
import { ICardService } from "../logic/CardService.js";
import { IUserService } from "../logic/UserService.js";
import { CardContainer, TavernCardV2 } from "../Cards.js";
import { ITavernCardService } from "../logic/TavernCardService.js";
import { UpdateInput } from "../logic/models/Card.js";

export interface ICardOrchestrator {
    Upload(request: CardUploadRequest): Promise<CardContainer<TavernCardV2>>
    Update(request: CardUpdateRequest): Promise<CardUpdateResponse>
}

class CardOrchestrator implements ICardOrchestrator {
    constructor(
        private readonly cardService: ICardService,
        private readonly userService: IUserService,
        private readonly tavernCardService: ITavernCardService
    ) { }

    async Upload(request: CardUploadRequest): Promise<CardContainer<TavernCardV2>> {
        logger.trace("CardOrchestrator.Upload");

        try {
            // Get logical user ID from canonical user ID
            const userId = await this.userService.GetUserModelByCanonicalUserId(request.CanonicalUserId);
    
            const card = this.tavernCardService.Parse(request.Json);
    
            const cardV2 = this.tavernCardService.CastToV2(card);
    
            return await this.cardService.Upload({
                Tagline: request.Tagline,
                UserId: userId.user_id,
                Visibility: request.Visibility,
                Card: cardV2
            })
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

        let cardV2: TavernCardV2 | undefined;

        if (request.Json) {
            const card = this.tavernCardService.Parse(request.Json);
            cardV2 = this.tavernCardService.CastToV2(card);
        }

        const input: UpdateInput = {
            Id: request.Identifier
        }

        if (request.Tagline) input.Tagline = request.Tagline;
        if (request.Visibility) input.Visibility = request.Visibility;
        if (cardV2) input.Card = cardV2;

        this.cardService.Update(input);

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