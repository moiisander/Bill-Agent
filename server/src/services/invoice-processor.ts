import OpenAI from "openai";
import { files, invoiceLineItems, invoices, voucherLines, vouchers } from "#db/schema.js";
import { db } from "#db/index.js";
import { eq } from "drizzle-orm";
import { OCRService } from "./ocr-service.js";

export class InvoiceProcessor {
  private openai: OpenAI;
  private ocrService: OCRService;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.ocrService = new OCRService();
  }

  async processInvoice(filePath: string, fileType: string, fileName: string) {
    try {
      const ocrResult = await this.ocrService.performOCR(filePath);

      const extractedData = await this.extractInvoiceData(ocrResult.text);

      const gaapAnalysis = await this.analyzeGAAPCompliance(extractedData);

      const fileRecord = await this.saveFile(filePath, fileName);
      const invoiceRecord = await this.saveInvoice(fileRecord.id, extractedData);
      const voucherRecord = await this.saveVoucher(invoiceRecord.id, gaapAnalysis);

      return {
        file: fileRecord,
        invoice: invoiceRecord,
        voucher: voucherRecord,
      };

    } catch (error) {
      console.error("Error processing invoice:", error);
      throw error;
    }
  }

  private async extractInvoiceData(ocrText: string) {
    const prompt = `
      Extract the following information from this invoice text. 

      Respond ONLY with a valid JSON object. Do not include explanations or text outside the JSON. 
      Dates must be in ISO 8601 format (YYYY-MM-DD). 
      All numbers must be valid JSON numbers (no quotes, no commas, no currency symbols). 
      If a field cannot be determined, use null.

      Schema:
      {
        "vendorName": "string",
        "invoiceNumber": "string", 
        "invoiceDate": "YYYY-MM-DD",
        "dueDate": "YYYY-MM-DD",
        "subtotal": number,
        "taxAmount": number,
        "totalAmount": number,
        "lineItems": [
          {
            "description": "string",
            "quantity": number,
            "unitPrice": number, 
            "amount": number
          }
        ]
      }

      Invoice text:
      ${ocrText}
    `;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert at extracting structured data from invoice text. Always return valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error("No response from OpenAI");

      return JSON.parse(response);
    } catch (error) {
      console.error("OpenAI extraction error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown extraction error";
      throw new Error(`Data extraction failed: ${errorMessage}`);
    }
  }

  private async analyzeGAAPCompliance(invoiceData: any) {
    const prompt = `
      You are an accounting assistant. Analyze the following invoice data for US GAAP compliance and suggest how it should be recorded in the accounting system.

      Invoice Data:
      ${JSON.stringify(invoiceData, null, 2)}

      Respond ONLY with a valid JSON object. Do not include any explanations or text outside the JSON.

      JSON structure:
      {
        "accountClassification": "string (e.g., Operating Expense, Capital Expense, etc.)",
        "expenseCategory": "string (e.g., Office Supplies, Professional Services, etc.)",
        "taxTreatment": "string (e.g., Deductible, Non-deductible, etc.)",
        "complianceNotes": ["array of compliance considerations"],
        "voucherLines": [
          {
            "accountCode": "string (e.g., 6000)",
            "description": "string",
            "debit": number,
            "credit": number
          }
        ]
      }

      Rules:
      - Classify expenses correctly under US GAAP (e.g., expense vs. capital asset).
      - Always return at least two voucherLines (double-entry: total debits = total credits).
      - Use numeric values for debit and credit (not strings).
      - Use neutral, professional accounting language.
      - Include notes that help maintain audit trail (e.g., "attach vendor invoice").
    `;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a certified public accountant and US GAAP expert. Provide accurate accounting guidance.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error("No response from OpenAI");

      return JSON.parse(response);
    } catch (error) {
      console.error("OpenAI GAAP analysis error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown GAAP analysis error";
      throw new Error(`GAAP analysis failed: ${errorMessage}`);
    }
  }

  private async saveFile(filePath: string, fileName: string) {
    const [fileRecord] = await db.insert(files).values({
      fileName: fileName,
      filePath: filePath,
    }).returning();
    return fileRecord;
  }

  private async saveInvoice(fileId: number, extractedData: any) {
    const [invoiceRecord] = await db.insert(invoices).values({
      fileId,
      vendorName: extractedData.vendorName,
      invoiceNumber: extractedData.invoiceNumber,
      invoiceDate: extractedData.invoiceDate,
      dueDate: extractedData.dueDate,
      subtotal: extractedData.subtotal,
      taxAmount: extractedData.taxAmount,
      totalAmount: extractedData.totalAmount,
    }).returning();

    const insertedLineItems = [];
    for (const item of extractedData.lineItems) {
      const [lineItem] = await db.insert(invoiceLineItems).values({
        invoiceId: invoiceRecord.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.amount,
      }).returning();
      insertedLineItems.push(lineItem);
    }
    
    return {
      ...invoiceRecord,
      lineItems: insertedLineItems,
    };
  }

  private async saveVoucher(invoiceId: number, gaapAnalysis: any) {
    const [voucherRecord] = await db.insert(vouchers).values({
      invoiceId,
      accountClassification: gaapAnalysis.accountClassification,
      expenseCategory: gaapAnalysis.expenseCategory,
      taxTreatment: gaapAnalysis.taxTreatment,
    }).returning();

    const insertedLineItems = [];
    for (const line of gaapAnalysis.voucherLines) {
      const [lineItem] = await db.insert(voucherLines).values({
        voucherId: voucherRecord.id,
        accountCode: line.accountCode,
        description: line.description,
        debit: line.debit,
        credit: line.credit,
      }).returning();
      insertedLineItems.push(lineItem);
    }

    return {
      ...voucherRecord,
      lineItems: insertedLineItems,
    };
  }
}
