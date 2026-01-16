import { Pool } from "pg";

export interface IUserStore {
    GetUserIdFromCanonicalUserId(canonicalUserId: string): Promise<string>
}

export class UserStore implements IUserStore {

    constructor(
        private readonly _pool: Pool
    ) {}

    async GetUserIdFromCanonicalUserId(canonicalUserId: string): Promise<string> {
        // use database_pool here; it's a singleton anyways
        return "hello, world!";
    }
}

export function CreateUserStore(pool: Pool): IUserStore {
    return new UserStore(pool);
}