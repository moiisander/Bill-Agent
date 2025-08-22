import { pgTable, serial, varchar, numeric, date, jsonb, timestamp } from "drizzle-orm/pg-core";

export const vouchers = pgTable("vouchers", {
  id: serial("id").primaryKey(),
  voucherNumber: varchar("voucher_number", { length: 50 }).notNull().unique(),
  date: date("date").notNull(), // store as YYYY-MM-DD string
  vendor: varchar("vendor", { length: 255 }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(), // store as string
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  data: jsonb("data").$type<{
    description?: string;
    account?: string;
    approvedBy?: string;
    supportingDocs?: string[];
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
