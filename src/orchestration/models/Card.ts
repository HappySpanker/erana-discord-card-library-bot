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
    Identifier: number,
    Visibility?: string,
    Tagline?: string,
    Json?: string,
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