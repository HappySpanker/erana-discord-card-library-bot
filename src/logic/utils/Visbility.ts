import { number } from "zod";

export function TranslateVisbilityStringToNumber(visbility: string): number {
    switch (visbility.toLowerCase()) {
        case "public": return 255;
        case "shared": return 32;
        case "listed": return 16;    
        case "private": return 0;
    }

    throw new Error(`Value '${visbility}' is an invalid string visibility`);
}

export function TranslateVisibilityNumberToString(visbility: number): string {
    switch (visbility) {
        case 0: return "private";
        case 16: return "listed";
        case 32: return "shared";
        case 255: return "public";
    }

    throw new Error(`Value '${visbility}' is an invalid numeric visibility`);
}