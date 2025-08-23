import { db } from "#db/index.js";
import {
    files,
    invoiceLineItems,
    invoices,
    voucherLines,
    vouchers,
} from "#db/schema.js";
import { InvoiceProcessor } from "#services/invoice-processor.js";
import { router, publicProcedure } from "#trpc/trpc.js";
import { inArray } from "drizzle-orm";
import { tmpdir } from "os";
import { join } from "path";
import { z } from "zod";

const invoiceProcessor = new InvoiceProcessor();

export const voucherRouter = router({
    processInvoice: publicProcedure
        .input(
            z.object({
                fileData: z.string(),
                fileName: z.string(),
                fileType: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const buffer = Buffer.from(input.fileData, "base64");
                const tempPath = join(
                    tmpdir(),
                    `${Date.now()}-${input.fileName}`
                );

                const fs = await import("fs");
                fs.writeFileSync(tempPath, buffer);

                const data = await invoiceProcessor.processInvoice(
                    tempPath,
                    input.fileType
                );

                fs.unlinkSync(tempPath);

                return data;
            } catch (error) {
                console.error("Invoice processing error:", error);
                throw new Error(
                    `Invoice processing failed: ${
                        error instanceof Error ? error.message : "Unknown error"
                    }`
                );
            }
        }),

    list: publicProcedure.query(async () => {
        try {
            const invoiceRows = await db.select().from(invoices);

            if (invoiceRows.length === 0) return [];

            const fileIds = invoiceRows.map((i) => i.fileId);
            const invoiceIds = invoiceRows.map((i) => i.id);

            const filesRows = await db
                .select()
                .from(files)
                .where(inArray(files.id, fileIds));

            const vouchersRows = await db
                .select()
                .from(vouchers)
                .where(inArray(vouchers.invoiceId, invoiceIds));

            if (vouchersRows.length === 0) return []; // no vouchers, return empty list

            const voucherIds = vouchersRows.map((v) => v.id);

            const voucherLinesRows = await db
                .select()
                .from(voucherLines)
                .where(inArray(voucherLines.voucherId, voucherIds));

            const lineItemsRows = await db
                .select()
                .from(invoiceLineItems)
                .where(inArray(invoiceLineItems.invoiceId, invoiceIds));

            const structured = invoiceRows
                .map((inv) => {
                    const voucherRecord =
                        vouchersRows.find((v) => v.invoiceId === inv.id) ||
                        null;

                    if (!voucherRecord) return null;

                    const fileRecord =
                        filesRows.find((f) => f.id === inv.fileId) || null;

                    const invoiceWithLineItems = {
                        ...inv,
                        lineItems: lineItemsRows.filter(
                            (li) => li.invoiceId === inv.id
                        ),
                    };

                    const voucherWithLines = {
                        ...voucherRecord,
                        lineItems: voucherLinesRows.filter(
                            (vl) => vl.voucherId === voucherRecord.id
                        ),
                    };

                    return {
                        file: fileRecord,
                        invoice: invoiceWithLineItems,
                        voucher: voucherWithLines,
                    };
                })
                .filter((item) => item !== null); // remove nulls

            return structured;
        } catch (error) {
            throw new Error(
                `Failed to fetch invoices: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }),
});
