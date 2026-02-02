import { CardModel, Error, Pagination } from "./Common.js"

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

// Card List
export type CardListResponse = {
    Items: Array<CardModel>,
    Pagination?: Pagination
}