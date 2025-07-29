import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({ path: ".env" });

// Use PostgreSQL for production (when DATABASE_URL is set)
// Use SQLite for local development
const isProduction = !!process.env.DATABASE_URL;

export default {
  schema: ["./src/db/schema.ts", "./src/db/auth-schema.ts"],
  out: isProduction ? "./migrations" : "./drizzle",
  dialect: isProduction ? "postgresql" : "sqlite",
  dbCredentials: isProduction
    ? {
        url: process.env.DATABASE_URL!,
      }
    : {
        url: "./notes.db",
      },
} satisfies Config;
