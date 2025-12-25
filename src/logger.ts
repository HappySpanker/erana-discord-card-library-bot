import pino from "pino";

export const logger = pino({
    level: process.env.LOG_LEVEL ?? "info",
    base: {
        service: "erana-discord-bot",
        env: process.env.NODE_ENV ?? "dev"
    },
    timestamp: pino.stdTimeFunctions.isoTime
});