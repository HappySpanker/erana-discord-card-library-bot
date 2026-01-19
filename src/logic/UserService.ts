import { IUserStore, UserDTO } from "../external/UserStore.js";
import { logger } from "../logger.js";

export interface IUserService {
  GetUserModelByCanonicalUserId(canonicalUserId: string): Promise<UserModel>;
}

export type UserModel = UserDTO;

class UserService {
  constructor(
    private _userStore: IUserStore
  ) { }

  async GetUserModelByCanonicalUserId(canonicalUserId: string): Promise<UserModel> {
    logger.trace({
      canonicalUserId
    }, "UserService.GetUserModelByCanonicalUserId")
    return this._userStore.GetUserFromCanonicalUserId(canonicalUserId);
  }
}

export function CreateUserService(userStore: IUserStore) {
  return new UserService(userStore);
}