import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

import * as schema from "./schema";
import * as authSchema from "./auth-schema";

config({ path: ".env" });

const allSchemas = { ...schema, ...authSchema };

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, {
  schema: allSchemas,
});
