ALTER TABLE "invoices" ADD COLUMN "vendor_address" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "vouchers" ADD COLUMN "voucher_number" varchar(20);--> statement-breakpoint
ALTER TABLE "vouchers" ADD COLUMN "invoice_number" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "vouchers" ADD COLUMN "vendor_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "vouchers" ADD COLUMN "vendor_address" varchar(255);--> statement-breakpoint
ALTER TABLE "vouchers" ADD COLUMN "company_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "vouchers" ADD COLUMN "company_address" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "vouchers" ADD COLUMN "issue_date" date;--> statement-breakpoint
ALTER TABLE "vouchers" ADD COLUMN "due_date" date;--> statement-breakpoint
ALTER TABLE "invoice_line_items" ADD CONSTRAINT "invoice_line_items_invoice_id_unique" UNIQUE("invoice_id");--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_voucher_number_unique" UNIQUE("voucher_number");