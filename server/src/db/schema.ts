import { pgTable, serial, varchar, numeric, date, jsonb, timestamp, text } from "drizzle-orm/pg-core";

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

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 100 }),
  vendorName: varchar("vendor_name", { length: 255 }).notNull(),
  vendorAddress: text("vendor_address"),
  invoiceDate: date("invoice_date"),
  dueDate: date("due_date"),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }),
  taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  
  // OCR extracted data
  ocrData: jsonb("ocr_data").$type<{
    rawText?: string;
    confidence?: number;
    extractedFields?: Record<string, any>;
  }>(),
  
  // GAAP compliance data
  gaapData: jsonb("gaap_data").$type<{
    accountClassification?: string;
    expenseCategory?: string;
    taxTreatment?: string;
    complianceNotes?: string[];
    suggestedAccounts?: string[];
  }>(),
  
  // Line items
  lineItems: jsonb("line_items").$type<Array<{
    description: string;
    quantity?: number;
    unitPrice?: number;
    amount: number;
    accountCode?: string;
  }>>(),
  
  // File attachments
  originalFile: varchar("original_file", { length: 500 }), // path to uploaded file
  fileType: varchar("file_type", { length: 50 }), // PDF, IMAGE, etc.
  
  processingStatus: varchar("processing_status", { length: 50 }).default("pending"),
  processingErrors: jsonb("processing_errors").$type<string[]>(),
  
  voucherId: serial("voucher_id").references(() => vouchers.id),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const processingLogs = pgTable("processing_logs", {
  id: serial("id").primaryKey(),
  invoiceId: serial("invoice_id").references(() => invoices.id),
  step: varchar("step", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // success, error, pending
  details: jsonb("details"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
