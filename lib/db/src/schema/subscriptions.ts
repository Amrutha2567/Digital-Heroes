import { pgTable, text, numeric, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const subscriptionIntervalEnum = pgEnum("subscription_interval", ["monthly", "yearly"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "cancelled", "lapsed", "pending"]);

export const subscriptionPlansTable = pgTable("subscription_plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  interval: subscriptionIntervalEnum("interval").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  prizePoolContribution: numeric("prize_pool_contribution", { precision: 10, scale: 2 }).notNull(),
  charityContribution: numeric("charity_contribution", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  features: text("features").array(),
  isActive: text("is_active").notNull().default("true"),
});

export const subscriptionsTable = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  planId: text("plan_id").notNull(),
  status: subscriptionStatusEnum("status").notNull().default("pending"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptionsTable).omit({ createdAt: true, updatedAt: true });
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptionsTable.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlansTable.$inferSelect;
