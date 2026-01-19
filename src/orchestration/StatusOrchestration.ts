import { IApplicationService } from "../logic/ApplicationService.js";
import { ISystemService } from "../logic/SystemService.js";
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

class StatusOrchestration
  implements IOrchestration<void, StatusValue> {

  constructor(
    private readonly _applicationService: IApplicationService,
    private readonly _systemService: ISystemService
  ) { }

  async orchestrate(payload: void): Promise<StatusValue> {

    return await Promise.resolve({
      Erana: {
        Uptime: this._applicationService.uptime
      },
      System: {
        Hostname: this._systemService.hostname,
        Uptime: this._systemService.uptime
      }
    })
  }
}

export function CreateStatusOrchestrator(
  applicationService: IApplicationService,
  systemService: ISystemService
): IOrchestration<void, StatusValue> {
  return new StatusOrchestration(
    applicationService,
    systemService
  );
}