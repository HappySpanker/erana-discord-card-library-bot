import { logger } from "../logger.js";

export interface ICardService {
    upload(): Promise<void>;

}

export class CardService implements ICardService {
    async upload(): Promise<void> {
        logger.debug("CardService");

        return Promise.resolve();
    }

}