import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
  }
  return databaseUrl;
}

function createDrizzle() {
  const databaseUrl = getDatabaseUrl();
  return drizzle(postgres(databaseUrl), { schema });
}

export type Drizzle = ReturnType<typeof createDrizzle>;

let drizzleSession: Drizzle;

try {
  if (process.env.NODE_ENV === "development") {
    if (!global._pgPool) {
      global._pgPool = createDrizzle();
      drizzleSession = global._pgPool;
    } else {
      drizzleSession = global._pgPool;
    }
  } else {
    drizzleSession = createDrizzle();
  }
} catch (error) {
  console.error("Failed to create database session:", error);
  process.exit(1);
}

export default drizzleSession;
