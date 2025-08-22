import { InvoiceProcessor } from "#services/invoice-processor.js";
import { router, publicProcedure } from "#trpc/trpc.js";
import { z } from "zod";

const invoiceProcessor = new InvoiceProcessor();

export const invoiceRouter = router({
  // Process invoice and return voucher data
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
        // Convert base64 to buffer and save temporarily
        const buffer = Buffer.from(input.fileData, 'base64');
        const tempPath = `/tmp/${Date.now()}-${input.fileName}`;
        
        // Write buffer to temp file
        const fs = await import('fs');
        fs.writeFileSync(tempPath, buffer);

        // Process the invoice
        const invoiceId = await invoiceProcessor.processInvoice(tempPath, input.fileType);

        // Get the processed data
        const status = await invoiceProcessor.getProcessingStatus(invoiceId);

        // Clean up temp file
        try {
          fs.unlinkSync(tempPath);
        } catch (cleanupError) {
          console.error('Failed to cleanup temp file:', cleanupError);
        }

        return {
          success: true,
          voucher: status.invoice,
          ocrConfidence: status.invoice?.ocrData?.confidence || 0,
        };

      } catch (error) {
        console.error('Invoice processing error:', error);
        throw new Error(`Invoice processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  // Get all invoices
  list: publicProcedure.query(async () => {
    try {
      return await invoiceProcessor.getAllInvoices();
    } catch (error) {
      throw new Error(`Failed to fetch invoices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }),

  // Get invoice by ID with processing logs
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        return await invoiceProcessor.getProcessingStatus(input.id);
      } catch (error) {
        throw new Error(`Failed to fetch invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
}); 