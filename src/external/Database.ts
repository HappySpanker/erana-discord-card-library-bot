import { Pool } from "pg";

export const database_pool = new Pool({
  host: process.env.PGSQL_HOST,
  port: Number(process.env.PGSQL_PORT),
  user: process.env.PGSQL_USER,
  password: process.env.PGSQL_PASSWORD,
  database: process.env.PGSQL_DATABASE,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});