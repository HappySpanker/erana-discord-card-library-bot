import humanizeDuration from "humanize-duration";
import { ApplicationStore, IApplicationStore } from "../external/ApplicationStore.js";

export interface IApplicationService {

    get uptime(): string
}

class ApplicationService
    implements IApplicationService {

    private readonly _applicationStore: IApplicationStore
        = new ApplicationStore();

    get uptime(): string {
        return humanizeDuration(
            this._applicationStore.uptime * 1000,
            {
                maxDecimalPoints: 0
            });
    }
}

export function CreateApplicationService(): IApplicationService {
    return new ApplicationService();
}