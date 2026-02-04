import { Pool } from "pg";
import { logger } from "../logger.js";
import { CardDTO, UpdateCardDto } from "./models/cardDTO.js";
import { TavernCardV2 } from "../Cards.js";
import { Temporal } from "@js-temporal/polyfill";

export interface ICardStore {
    ListByUser(userId: string): Promise<Array<CardDTO>>
    Upload(dto: Partial<CardDTO>): Promise<CardDTO>
    Update(dto: UpdateCardDto): Promise<CardDTO>
}

class CardStore implements ICardStore {

    constructor(
        private readonly _pool: Pool
    ) { }

    async Upload(dto: Partial<CardDTO>): Promise<CardDTO> {
        logger.trace({
            userId: dto.user_id,
            visibility: dto.visibility,
            tagline: dto.tagline?.substring(0, 32),
        },
            "CardStore.Upload");

        // Try to upload card
        try {
            const result = await this._pool.query<CardDTO>(`INSERT INTO public.cards(
	user_id, card, tagline, visibility)
	VALUES ($1, $2, $3, $4) RETURNING *;`,
                [
                    dto.user_id,
                    dto.card,
                    dto.tagline,
                    dto.visibility
                ]
            );

            const brokenCardDTO = result.rows[0]!;
            const cardDTO = this.fixDatesToTemporals(brokenCardDTO);

            return cardDTO;
        } catch (err) {
            logger.error({
                userId: dto.user_id,
                visibility: dto.visibility,
                tagline: dto.tagline?.substring(0, 32),
                err
            },
                "Error uploading card to database");

            throw err;
        }
    }

    async Update(dto: UpdateCardDto): Promise<CardDTO> {
        logger.trace({
            id: dto.Id
        },
            "CardStore.Update");

        // Try to upload card
        try {
            const result = await this._pool.query<CardDTO>(`
UPDATE public.cards SET
    card = COALESCE($2, card),
    tagline = COALESCE($3, tagline),
    visibility = COALESCE($4, visibility)
WHERE cards.id = $1
RETURNING *;
        `,
                [
                    dto.Id,
                    dto.Card,
                    dto.Tagline,
                    dto.Visibility
                ]
            );

            const brokenCardDTO = result.rows[0]!;
            const cardDTO = this.fixDatesToTemporals(brokenCardDTO);

            return cardDTO;
        } catch (err) {
            logger.error(err, "Error uploading card to database");
            throw err;
        }
    }

    /**
     * Lists all cards
     * @param userId The canonical user ID to list
     * @returns The cards belonging to that user
     */
    async ListByUser(userId: string): Promise<CardDTO[]> {
        logger.trace({
            userId
        },
            "CardStore.ListByUser")
        try {
            const res = await this._pool.query<CardDTO>(
                `
        SELECT 
          cards.id,
          cards.user_id::text AS user_id,
          cards.tagline,
          cards.card,
          cards.created,
          cards.updated
        FROM public.cards
        JOIN public.users ON cards.user_id = users.id
        WHERE 1=1
          AND users.canonical_user_id = $1::bigint
        `,
                [userId]
            );

            const cardDTOs = res.rows.map(dto => this.fixDatesToTemporals(dto));
            return cardDTOs;
        } catch (err) {
            logger.error({
                err,
                userId
            },
                "Call to ListByUser failed"
            );

            throw err;
        }
    }

    // Needed to deal with Temporal→Date→Temportal converstions
    private fixDatesToTemporals(dto: CardDTO): CardDTO {
        const createdDate = (<unknown>dto.created) as Date;
        const updateDate = (<unknown>dto.updated) as Date;

        dto.created = Temporal.Instant.fromEpochMilliseconds(createdDate.getTime());
        dto.updated = Temporal.Instant.fromEpochMilliseconds(updateDate.getTime());

        return dto;
    }
}

export function CreateCardStore(pool: Pool): ICardStore {
    return new CardStore(pool);
}