import { hostname, uptime } from "os";

export interface ISystemStore {

    get hostname(): string;

    get uptime(): number;
}

class SystemStore
    implements ISystemStore {

    get hostname(): string {
        return hostname()
    }

    get uptime(): number {
        return uptime();
    }
}

export function CreateSystemStore(): ISystemStore {
    return new SystemStore();
}