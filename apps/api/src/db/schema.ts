import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  repoUrl: varchar("repo_url", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("queued"),
  createdAt: timestamp("created_at").defaultNow(),
});
