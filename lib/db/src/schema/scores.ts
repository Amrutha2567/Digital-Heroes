import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const golfScoresTable = pgTable("golf_scores", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  score: integer("score").notNull(),
  playedAt: timestamp("played_at").notNull(),
  course: text("course"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGolfScoreSchema = createInsertSchema(golfScoresTable).omit({ createdAt: true });
export type InsertGolfScore = z.infer<typeof insertGolfScoreSchema>;
export type GolfScore = typeof golfScoresTable.$inferSelect;
