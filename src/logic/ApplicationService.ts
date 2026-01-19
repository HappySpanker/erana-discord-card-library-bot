import humanizeDuration from "humanize-duration";
import { IApplicationStore } from "../external/ApplicationStore.js";

export interface IApplicationService {

  get uptime(): string
}

class ApplicationService
  implements IApplicationService {

  constructor(
    private readonly _applicationStore: IApplicationStore
  ) { }

  get uptime(): string {
    return humanizeDuration(
      this._applicationStore.uptime * 1000,
      {
        maxDecimalPoints: 0
      });
  }
}

export function CreateApplicationService(
  applicationStore: IApplicationStore): IApplicationService {
  return new ApplicationService(applicationStore);
}