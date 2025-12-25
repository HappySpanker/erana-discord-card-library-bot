import humanizeDuration from "humanize-duration";
import { ISystemStore, SystemStore } from "../external/SystemStore.js";

export interface ISystemService {

    get uptime(): string;

    get hostname(): string;
}

export class SystemService
    implements ISystemService {

    private readonly _systemStore: ISystemStore = new SystemStore();

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