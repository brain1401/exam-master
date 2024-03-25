import "dotenv/config";
import type { Config } from "drizzle-kit";

if(process.env.DATABASE_URL === undefined) {
  throw new Error("DATABASE_URL is not defined");
}

export default {
  schema: "src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
