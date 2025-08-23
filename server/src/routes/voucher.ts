import { db } from "#db/index.js";
import { files, invoiceLineItems, invoices, voucherLines, vouchers } from "#db/schema.js";
import { InvoiceProcessor } from "#services/invoice-processor.js";
import { router, publicProcedure } from "#trpc/trpc.js";
import { inArray } from "drizzle-orm";
import { z } from "zod";

const invoiceProcessor = new InvoiceProcessor();

export const voucherRouter = router({

  processInvoice: publicProcedure
    .input(
      z.object({
        fileData: z.string(), // Base64 encoded file data
        fileName: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const buffer = Buffer.from(input.fileData, 'base64');
        const tempPath = `/tmp/${Date.now()}-${input.fileName}`;
        
        const fs = await import('fs');
        fs.writeFileSync(tempPath, buffer);

        const data = await invoiceProcessor.processInvoice(tempPath, input.fileType, input.fileName);

        fs.unlinkSync(tempPath);

        return data;

      } catch (error) {
        console.error('Invoice processing error:', error);
        throw new Error(`Invoice processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  list: publicProcedure.query(async () => {
    try {
      const invoiceRows = await db.select().from(invoices);

      const fileIds = invoiceRows.map(i => i.fileId);
      const invoiceIds = invoiceRows.map(i => i.id);

      const filesRows = await db.select().from(files).where(inArray(files.id, fileIds));
      const lineItemsRows = await db.select().from(invoiceLineItems).where(inArray(invoiceLineItems.invoiceId, invoiceIds));
      const vouchersRows = await db.select().from(vouchers).where(inArray(vouchers.invoiceId, invoiceIds));

      const voucherIds = vouchersRows.map(v => v.id);
      const voucherLinesRows = await db.select().from(voucherLines).where(inArray(voucherLines.voucherId, voucherIds));

      const structured = invoiceRows.map(inv => {
        const file = filesRows.find(f => f.id === inv.fileId) || null;
        const lineItems = lineItemsRows.filter(li => li.invoiceId === inv.id);
        const voucher = vouchersRows.find(v => v.invoiceId === inv.id) || null;
        const voucherLines = voucher ? voucherLinesRows.filter(vl => vl.voucherId === voucher.id) : [];

        return {
          ...inv,
          file,
          lineItems,
          voucher: voucher ? { ...voucher, voucherLines } : null,
        };
      });

      return structured;
    } catch (error) {
      throw new Error(`Failed to fetch invoices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }),
}); 
