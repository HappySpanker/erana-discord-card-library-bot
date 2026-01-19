import humanizeDuration from "humanize-duration";
import { ISystemStore } from "../external/SystemStore.js";

export interface ISystemService {

    get uptime(): string;

    get hostname(): string;
}

class SystemService
    implements ISystemService {

    constructor(
        private readonly _systemStore: ISystemStore
    ) { }

    get hostname(): string {
        return this._systemStore.hostname;
    }

    get uptime(): string {
        return humanizeDuration(
            this._systemStore.uptime * 1000,
            {
                maxDecimalPoints: 0
            });
    }
}

export function CreateSystemService(
    systemStore: ISystemStore): ISystemService {
    return new SystemService(systemStore);
}