import { any, object } from "zod"
import { CardModel } from "./CardModel.js"
import { Error } from "./Common.js"

export type CardUploadRequest = {
    CanonicalUserId: string,
    Visibility: string,
    Tagline: string,
    Json: string,
}

export type CardUploadResponse = Error & {
    Result: CardModel
}

export type CardUpdateRequest = {
    CanonicalUserId: string,
    Identifier: string,
    Visibility: string | null,
    Tagline: string | null,
    Json: string | null,
}

export type CardUpdateResponse = Error & {
    Result: CardModel
}