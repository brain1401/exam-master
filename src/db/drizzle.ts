import postgres from "postgres";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { resolve } from "path";

if (process.env.DATABASE_URL === undefined) {
  throw new Error("DATABASE_URL is not defined");
}

const queryClient = postgres(process.env.DATABASE_URL);

const drizzleSession = drizzle(queryClient, { schema });

migrate(drizzleSession, { migrationsFolder: resolve(__dirname, "./drizzle") });

export default drizzleSession;
