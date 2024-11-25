import { defineConfig } from "drizzle-kit";

const DEV_DATABASE_URL = process.env.DATABASE_URL;

if (DEV_DATABASE_URL === undefined) {
  throw new Error("DATABASE_URL is not defined");
}

export default defineConfig({
  schema: "src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DEV_DATABASE_URL,
  },
});

// 개발 데이터베이스에 스키마 동기화 명령어
// pnpm drizzle-kit push --verbose
