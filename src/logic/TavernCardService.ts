import { AnyTavernCard, TavernCardV2, TavernCardV3 } from "../Cards.js";
import { IsTavernCardV2 } from "./schemas/TavernCardV2Schema.js";
import { IsTavernCardV3 } from "./schemas/TavernCardV3Schema.js";

export interface ITavernCardService {
    Parse(json: string): AnyTavernCard;
    CastToV2(card: AnyTavernCard): TavernCardV2;
}

class TavernCardService implements ITavernCardService {

    public Parse(json: string): AnyTavernCard {

        const parsed = JSON.parse(json);

        if(IsTavernCardV3(parsed)) return parsed;

        if(IsTavernCardV2(parsed)) return parsed;

        throw new Error("Unable to parsed JSON to either TavernCardV2 or TavernCardV3");
    }

    public CastToV2(card: AnyTavernCard): TavernCardV2 {
        
        // Quick exit
        if (IsTavernCardV2(card)) return card;

        if (IsTavernCardV3(card)) return this.translateToTaverCardV2(card);
            
        throw new Error("Unable to cast card to TaverCardV2 format; unknown type");
    }

    /**
     * While the ST V3 is a proper idea; it's verbose and there's no need to 
     * keep V1 backwards compatibility in store.
     * @param card The TavernV3Card to transform
     * @returns A true TavernCardV2
     */
    private translateToTaverCardV2(card: TavernCardV3): TavernCardV2 {
        return {
        spec: "chara_card_v2",
        spec_version: "2.0",
        data: { ...card.data }
        }
    }
}

export function CreateTavernCardService(): ITavernCardService {
    return new TavernCardService();
}