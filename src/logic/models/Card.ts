import { CardContainer, TavernCardV2 } from "../../Cards.js"

export type UploadInput = {
    UserId: string,
    Visibility: string,
    Tagline: string,
    Card: TavernCardV2
}

export type UploadOutput = {
    UserId: string,
    Visibility: string,
    Tagline: string,
    Card: TavernCardV2
}

export type  UpdateInput = {
    Id: string,
    Visibility?: string,
    Tagline?: string,
    Card?: TavernCardV2
}