import { defineConfig } from "drizzle-kit";

const PROD_DATABASE_URL = process.env.PRODUCTION_DATABASE_URL;

if (PROD_DATABASE_URL === undefined) {
  throw new Error("PRODUCTION_DATABASE_URL is not defined");
}

export default defineConfig({
  schema: "src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: PROD_DATABASE_URL,
  },
});

// 프로덕션 데이터베이스에 스키마 동기화 명령어
// pnpm drizzle-kit push --config=drizzle-prod.config.ts --verbose
