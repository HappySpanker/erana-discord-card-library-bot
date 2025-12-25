import humanizeDuration from "humanize-duration"
import { hostname, uptime } from "os";

export interface ISystemStore {

    get hostname(): string;

    get uptime(): number;
}

export class SystemStore
    implements ISystemStore {

    get hostname(): string {
        return hostname()
    }

    get uptime(): number {
        return uptime();
    }
}