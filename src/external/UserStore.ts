import { Pool } from "pg";
import { logger } from "../logger.js";

export interface IUserStore {
  GetUserFromCanonicalUserId(canonicalUserId: string): Promise<UserDTO>
}

export type UserDTO = {
  user_id: string,
  discord_user_id: string
}

export class UserStore implements IUserStore {

  constructor(
    private readonly _pool: Pool
  ) { }

  async GetUserFromCanonicalUserId(canonicalUserId: string): Promise<UserDTO> {
    logger.trace({
      canonicalUserId
    }, "UserStore.GetUserFromCanonicalUserId");

    try {
      const response = await this._pool.query<UserDTO>(
`SELECT
  u.id as user_id,
  u.discord_user_id
FROM users AS u
WHERE u.discord_user_id = $1`,
        [ canonicalUserId ]);

      const result = response.rows[0];

      if (!result) {
        throw new Error("CanonicalUserId not found");
      }

      return result;
    } catch(err) {
      logger.error(err);
      throw err;
    }
  }
}

export function CreateUserStore(pool: Pool): IUserStore {
  return new UserStore(pool);
}