import { IUserStore, UserDTO } from "../external/UserStore.js";
import { logger } from "../logger.js";

export interface IUserService {
  GetUserIdByCanonicalUserId(canonicalUserId: string): Promise<string>;
}

export type UserModel = UserDTO;

class UserService {
  constructor(
    private _userStore: IUserStore
  ) { }

  async GetUserIdByCanonicalUserId(canonicalUserId: string): Promise<string> {
    logger.trace("UserService.GetUserIdByCanonicalUserId");

    const { user_id } = await this._userStore.GetUserFromCanonicalUserId(canonicalUserId);
    return user_id;
  }
}

export function CreateUserService(userStore: IUserStore) {
  return new UserService(userStore);
}