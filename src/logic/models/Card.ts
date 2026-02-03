import { CardContainer, TavernCardV2 } from "../../Cards.js"

export type UploadInput = {
    UserId: number,
    Visibility: string,
    Tagline: string,
    Card: TavernCardV2
}

export type UploadOutput = {
    UserId: number,
    Visibility: string,
    Tagline: string,
    Card: TavernCardV2
}

export type  UpdateInput = Pick<CardContainer, "Id" | "Card" | "Tagline" | "Visibility" | "IsV2">