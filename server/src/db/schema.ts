import { pgTable, serial, varchar, numeric, date, jsonb, timestamp, text, integer } from "drizzle-orm/pg-core";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  filePath: text("file_path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").references(() => files.id).notNull(),
  vendorName: varchar("vendor_name", { length: 255 }).notNull(),
  invoiceNumber: varchar("invoice_number", { length: 100 }).notNull(),
  invoiceDate: date("invoice_date"),
  dueDate: date("due_date"),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }),
  taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invoiceLineItems = pgTable("invoice_line_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").references(() => invoices.id).notNull(),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 12, scale: 2 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
});

export const vouchers = pgTable("vouchers", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").references(() => invoices.id).notNull(),
  accountClassification: varchar("account_classification", { length: 100 }).notNull(),
  expenseCategory: varchar("expense_category", { length: 100 }).notNull(),
  taxTreatment: varchar("tax_treatment", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const voucherLines = pgTable("voucher_lines", {
  id: serial("id").primaryKey(),
  voucherId: integer("voucher_id").references(() => vouchers.id).notNull(),
  accountCode: varchar("account_code", { length: 50 }).notNull(),
  description: text("description").notNull(),
  debit: numeric("debit", { precision: 12, scale: 2 }),
  credit: numeric("credit", { precision: 12, scale: 2 }),
});

