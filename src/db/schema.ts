import {
  pgTable,
  text as pgText,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// PostgreSQL schema (for production with Neon)
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: pgText("title").notNull(),
  content: pgText("content").notNull(),
  editorState: pgText("editor_state"), // JSON string of the lexical editor state
  createdBy: pgText("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
