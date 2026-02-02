import { Temporal } from "@js-temporal/polyfill";

export type CardModel = {
    Name: string;
    CanonicalUserId: string;
    Tagline: string;
    URL: string;
    Created: Temporal.Instant;
    Updated: Temporal.Instant;
}

export type Error = {
    Success: boolean,
    Error?: string
}

export type Pagination = false | {
    Previous?: number,
    Current: number,
    Next?: number
}