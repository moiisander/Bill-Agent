import { router, publicProcedure } from "#trpc/trpc.js";
import { z } from "zod";
import path from "path";
import os from "os";
import OpenAI from 'openai';
import Tesseract from 'tesseract.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const invoiceRouter = router({
  // Simple invoice processing: OCR + AI → return voucher (no database)
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
        
        // Use OS temp directory instead of hardcoded /tmp/
        const tempDir = os.tmpdir();
        const tempPath = path.join(tempDir, `${Date.now()}-${input.fileName}`);
        
        // Write buffer to temp file
        const fs = await import('fs');
        fs.writeFileSync(tempPath, buffer);

        console.log('Processing invoice:', input.fileName);

        // Step 1: OCR Processing
        console.log('Performing OCR...');
        const ocrResult = await Tesseract.recognize(tempPath, 'eng');
        const extractedText = ocrResult.data.text;
        
        console.log('OCR completed, confidence:', ocrResult.data.confidence, extractedText);

        // Step 2: Use OpenAI to extract voucher data
        console.log('Extracting voucher data with OpenAI...');
        const voucherData = await extractVoucherData(extractedText);

        // Clean up temp file
        try {
          fs.unlinkSync(tempPath);
        } catch (cleanupError) {
          console.error('Failed to delete temp file:', cleanupError);
        }

        // Return the processed voucher data directly
        console.log("successfully created a voucher", voucherData)
        return {
          success: true,
          voucher: voucherData,
          ocrConfidence: ocrResult.data.confidence,
        };

      } catch (error) {
        console.error('Invoice processing error:', error);
        
        // Clean up temp file on error
        try {
          const fs = await import('fs');
          const tempDir = os.tmpdir();
          const tempPath = path.join(tempDir, `${Date.now()}-${input.fileName}`);
          if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
          }
        } catch (cleanupError) {
          console.error('Failed to cleanup temp file:', cleanupError);
        }
        
        throw new Error(`Invoice processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  // Simple list endpoint that returns mock data (no database)
  list: publicProcedure.query(async () => {
    // Return mock data for now
    return [
      {
        id: 1,
        invoiceNumber: "INV-2024-001",
        vendorName: "Office Supplies Co",
        totalAmount: "150.00",
        processingStatus: "completed"
      },
      {
        id: 2,
        invoiceNumber: "INV-2024-002", 
        vendorName: "Tech Services Inc",
        totalAmount: "299.99",
        processingStatus: "completed"
      }
    ];
  }),

  // Simple get by ID endpoint (no database)
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      // Return mock data for now
      return {
        invoice: {
          id: input.id,
          invoiceNumber: `INV-2024-00${input.id}`,
          vendorName: "Sample Vendor",
          totalAmount: "100.00",
          processingStatus: "completed"
        },
        logs: []
      };
    }),
});

// Helper function to extract voucher data using OpenAI
async function extractVoucherData(ocrText: string) {
  const prompt = `
  Extract invoice information and format it as a US GAAP-compliant voucher. Return ONLY a valid JSON object with this exact structure:

  {
    "voucherNumber": "string (generate a unique voucher number)",
    "date": "YYYY-MM-DD",
    "vendor": "string",
    "amount": "number (total amount without currency symbol)",
    "description": "string (brief description of goods/services)",
    "accountCode": "string (suggested GL account code)",
    "expenseCategory": "string (e.g., Office Supplies, Professional Services)",
    "lineItems": [
      {
        "description": "string",
        "quantity": "number",
        "unitPrice": "number",
        "amount": "number"
      }
    ],
    "taxAmount": "number",
    "subtotal": "number",
    "notes": "string (any accounting notes or compliance considerations)"
  }

  Invoice text from OCR:
  ${ocrText}

  Important:
  - Generate a realistic voucher number (e.g., V-2024-001)
  - Use today's date if invoice date is unclear
  - Ensure all amounts are numbers (no currency symbols)
  - Suggest appropriate GL account codes
  - Make it US GAAP compliant
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert accountant. Extract invoice data and format it as a US GAAP-compliant voucher. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from OpenAI');

    return JSON.parse(response);
  } catch (error) {
    console.error('OpenAI error:', error);
    throw new Error('Failed to extract voucher data');
  }
} 