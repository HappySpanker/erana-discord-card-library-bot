import { Temporal } from "@js-temporal/polyfill";

export type CardContext = {
    Name: string;
    CanonicalUserId: string;
    Tagline: string;
    URL: string;
    Created: Temporal.Instant;
    Updated: Temporal.Instant;
}