import { CardContainer, TavernCardV2 } from "../../Cards.js";
import { CardDTO } from "../../external/models/cardDTO.js";

export function ConvertToCardContainerV2(dto: CardDTO): CardContainer<TavernCardV2> {
    return new CardContainer(
        dto.card,
        dto.visibility,
        dto.tagline,
        dto.id,
        dto.user_id,
        dto.created,
        dto.updated,
    )
}