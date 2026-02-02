import { Temporal } from "@js-temporal/polyfill";

export type CardUpdateModel = {
    Name: string;
    CanonicalUserId: string;
    Tagline: string;
    URL: string;
    Created: Temporal.Instant;
    Updated: Temporal.Instant;
}

export type CardUploadModel = {
    Name: string;
    CanonicalUserId: string;
    Tagline: string;
    URL: string;
    Created: Temporal.Instant;
    Updated: Temporal.Instant;
}

export type CardListModel = {
    Name: string;
    CanonicalUserId: string;
    Tagline: string;
    URL: string;
    Created: Temporal.Instant;
    Updated: Temporal.Instant;
}

export type ErrorResponse = {
    Success: false,
    Error: string
}

export type Pagination = false | {
    Previous?: number,
    Current: number,
    Next?: number
}