import { Pool } from "pg";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";

if (process.env.DATABASE_URL === undefined) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const drizzleSession = drizzle(pool, { schema });

export default drizzleSession;
