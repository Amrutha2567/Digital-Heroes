import { pgTable, text, integer, numeric, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const drawStatusEnum = pgEnum("draw_status", ["pending", "published", "completed"]);
export const drawTypeEnum = pgEnum("draw_type", ["random", "algorithmic"]);
export const matchTypeEnum = pgEnum("match_type", ["five_match", "four_match", "three_match"]);
export const verificationStatusEnum = pgEnum("verification_status", ["pending", "approved", "rejected"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid"]);

export const drawsTable = pgTable("draws", {
  id: text("id").primaryKey(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  status: drawStatusEnum("status").notNull().default("pending"),
  drawType: drawTypeEnum("draw_type").notNull().default("random"),
  drawnNumbers: integer("drawn_numbers").array(),
  totalPool: numeric("total_pool", { precision: 12, scale: 2 }).notNull().default("0"),
  jackpotAmount: numeric("jackpot_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  jackpotRolledOver: boolean("jackpot_rolled_over").notNull().default(false),
  participantCount: integer("participant_count").notNull().default(0),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const drawParticipationsTable = pgTable("draw_participations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  drawId: text("draw_id").notNull(),
  numbers: integer("numbers").array().notNull(),
  matchCount: integer("match_count").notNull().default(0),
  isWinner: boolean("is_winner").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const winnersTable = pgTable("winners", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  drawId: text("draw_id").notNull(),
  matchType: matchTypeEnum("match_type").notNull(),
  prizeAmount: numeric("prize_amount", { precision: 12, scale: 2 }).notNull(),
  verificationStatus: verificationStatusEnum("verification_status").notNull().default("pending"),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  proofUrl: text("proof_url"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDrawSchema = createInsertSchema(drawsTable).omit({ createdAt: true });
export type InsertDraw = z.infer<typeof insertDrawSchema>;
export type Draw = typeof drawsTable.$inferSelect;
export type DrawParticipation = typeof drawParticipationsTable.$inferSelect;
export type Winner = typeof winnersTable.$inferSelect;
