import { Temporal } from "@js-temporal/polyfill";

export type CardListItem = {
    Name: string;
    UserId: string;
    Tagline: string;
    URL: string;
    Created: Temporal.Instant;
    Updated: Temporal.Instant;
}