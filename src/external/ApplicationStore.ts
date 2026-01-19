export interface IApplicationStore {
    get uptime(): number;
}

class ApplicationStore 
    implements IApplicationStore {

    get uptime(): number {
        return process.uptime();
    }
}

export function CreateApplicationStore(): IApplicationStore {
    return new ApplicationStore();
}