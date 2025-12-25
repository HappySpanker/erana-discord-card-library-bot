import { ApplicationService, IApplicationService } from "../logic/ApplicationService.js";
import { ISystemService, SystemService } from "../logic/SystemService.js";
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

    private readonly _applicationServices: IApplicationService
        = new ApplicationService();

    private readonly _systemService: ISystemService
        = new SystemService();

    async orchestrate(payload: void): Promise<StatusValue> {
        
        return await Promise.resolve({
            Erana: {
                Uptime: this._applicationServices.uptime
            },
            System: {
                Hostname: this._systemService.hostname,
                Uptime: this._systemService.uptime
            }
        })
    }
}