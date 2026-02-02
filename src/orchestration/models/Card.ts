import { CardContext } from "./CardContext.js"
import { Error } from "./Common.js"

export type CardUploadRequest = {
    CanonicalUserId: string,
    Visibility: string,
    Tagline: string,
    Json: string,
}

export type CardUploadResponse = Error & {
    Result: CardContext
}

export type CardUpdateRequest = {
    CanonicalUserId: string,
    Identifier: string,
    Visibility: string | null,
    Tagline: string | null,
    Json: string | null,
}

export type CardUpdateResponse = Error & {
    Result: CardContext
}