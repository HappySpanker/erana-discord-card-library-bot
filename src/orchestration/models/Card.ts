import { CardListModel, CardUpdateModel, CardUploadModel, ErrorResponse, Pagination } from "./Common.js"

export type CardUploadRequest = {
    CanonicalUserId: string,
    Visibility: string,
    Tagline: string,
    Json: string,
}

export type CardUploadResponse = {
    Result: CardUploadModel
}

export type CardUpdateRequest = {
    CanonicalUserId: string,
    Identifier: string,
    Visibility: string | null,
    Tagline: string | null,
    Json: string | null,
}

export type CardUpdateResponse = {
    Result: CardUpdateModel
}

// Card List
export type CardListResponse = ErrorResponse | {
    Success: true,
    Items: CardListModel[],
    Pagination?: Pagination
}