import { IOrchestration } from "./interfaces/IOrchestration.js";

export type StatusValue = {
    Erana: {
        Uptime: string
    },
    System: {
        Uptime: string,
        Hostname: string
    }
}

export class StatusOrchestration
    implements IOrchestration<void, StatusValue> {

    async orchestrate(payload: void): Promise<StatusValue> {
        
        return await Promise.resolve({
            Erana: {
                Uptime: "Unknown"
            },
            System: {
                Uptime: "Unknown",
                Hostname: "Unknown"
            }
        })
    }
}