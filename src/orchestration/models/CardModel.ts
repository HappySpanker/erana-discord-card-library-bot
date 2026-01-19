import { Temporal } from "@js-temporal/polyfill";

export type CardModel = {
    Name: string;
    CanonicalUserId: string;
    Tagline: string;
    URL: string;
    Created: Temporal.Instant;
    Updated: Temporal.Instant;
}