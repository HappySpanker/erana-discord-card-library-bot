import humanizeDuration from "humanize-duration";

export interface IApplicationStore {
    get uptime(): number;
}

export class ApplicationStore 
    implements IApplicationStore {

    get uptime(): number {
        return process.uptime();
    }
}