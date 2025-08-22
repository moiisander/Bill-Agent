import OpenAI from 'openai';
import Tesseract from 'tesseract.js';
import { invoices, processingLogs } from '#db/schema.js';
import { db } from '#db/index.js';
import { eq } from 'drizzle-orm';

export class InvoiceProcessor {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Process an uploaded invoice file
   */
  async processInvoice(filePath: string, fileType: string): Promise<number> {
    let invoiceId: number | undefined;
    
    try {
      // Create invoice record
      const [invoice] = await db.insert(invoices).values({
        originalFile: filePath,
        fileType: fileType,
        processingStatus: 'processing',
        vendorName: 'Unknown', // Will be updated after OCR
        totalAmount: '0.00',
      }).returning();

      invoiceId = invoice.id;

      // Log processing start
      await this.logProcessingStep(invoiceId, 'start', 'success', { filePath, fileType });

      // Step 1: OCR Processing
      const ocrResult = await this.performOCR(filePath);
      await this.logProcessingStep(invoiceId, 'ocr', 'success', { confidence: ocrResult.confidence });

      // Step 2: Extract structured data from OCR text
      const extractedData = await this.extractInvoiceData(ocrResult.text);
      await this.logProcessingStep(invoiceId, 'extraction', 'success', extractedData);

      // Step 3: GAAP Compliance Analysis
      const gaapAnalysis = await this.analyzeGAAPCompliance(extractedData);
      await this.logProcessingStep(invoiceId, 'gaap_analysis', 'success', gaapAnalysis);

      // Step 4: Update invoice with processed data
      await db.update(invoices)
        .set({
          vendorName: extractedData.vendorName || 'Unknown',
          invoiceNumber: extractedData.invoiceNumber,
          invoiceDate: extractedData.invoiceDate,
          dueDate: extractedData.dueDate,
          subtotal: extractedData.subtotal,
          taxAmount: extractedData.taxAmount,
          totalAmount: extractedData.totalAmount,
          lineItems: extractedData.lineItems,
          ocrData: {
            rawText: ocrResult.text,
            confidence: ocrResult.confidence,
            extractedFields: extractedData,
          },
          gaapData: gaapAnalysis,
          processingStatus: 'completed',
        })
        .where(eq(invoices.id, invoiceId));

      await this.logProcessingStep(invoiceId, 'completion', 'success', { status: 'completed' });

      return invoiceId;

    } catch (error) {
      console.error('Error processing invoice:', error);
      
      // Log error and update status
      if (invoiceId !== undefined) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        await this.logProcessingStep(invoiceId, 'error', 'error', { 
          error: errorMessage,
          stack: errorStack 
        });
        
        await db.update(invoices)
          .set({
            processingStatus: 'error',
            processingErrors: [errorMessage],
          })
          .where(eq(invoices.id, invoiceId));
      }
      
      throw error;
    }
  }

  /**
   * Perform OCR on the uploaded file
   */
  private async performOCR(filePath: string): Promise<{ text: string; confidence: number }> {
    try {
      const result = await Tesseract.recognize(filePath, 'eng', {
        logger: m => console.log(m),
      });

      return {
        text: result.data.text,
        confidence: result.data.confidence || 0,
      };
    } catch (error) {
      console.error('OCR Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown OCR error';
      throw new Error(`OCR processing failed: ${errorMessage}`);
    }
  }

  /**
   * Extract structured data from OCR text using OpenAI
   */
  private async extractInvoiceData(ocrText: string) {
    const prompt = `
    Extract the following information from this invoice text. Return only a valid JSON object with these exact field names:
    
    {
      "vendorName": "string",
      "invoiceNumber": "string", 
      "invoiceDate": "YYYY-MM-DD",
      "dueDate": "YYYY-MM-DD",
      "subtotal": "number",
      "taxAmount": "number",
      "totalAmount": "number",
      "lineItems": [
        {
          "description": "string",
          "quantity": "number",
          "unitPrice": "number", 
          "amount": "number"
        }
      ]
    }
    
    Invoice text:
    ${ocrText}
    
    If a field cannot be determined, use null. Ensure all monetary amounts are numbers without currency symbols.
    `;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert at extracting structured data from invoice text. Always return valid JSON."
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
      console.error('OpenAI extraction error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown extraction error';
      throw new Error(`Data extraction failed: ${errorMessage}`);
    }
  }

  /**
   * Analyze GAAP compliance using OpenAI
   */
  private async analyzeGAAPCompliance(invoiceData: any) {
    const prompt = `
    Analyze this invoice data for US GAAP compliance and provide accounting guidance:
    
    Invoice Data: ${JSON.stringify(invoiceData, null, 2)}
    
    Provide a JSON response with:
    {
      "accountClassification": "string (e.g., Operating Expense, Capital Expense, etc.)",
      "expenseCategory": "string (e.g., Office Supplies, Professional Services, etc.)",
      "taxTreatment": "string (e.g., Deductible, Non-deductible, etc.)",
      "complianceNotes": ["array of compliance considerations"],
      "suggestedAccounts": ["array of suggested GL account codes"]
    }
    
    Consider:
    - Proper expense classification
    - Capitalization vs. expensing rules
    - Tax implications
    - Industry best practices
    - Audit trail requirements
    `;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a certified public accountant and US GAAP expert. Provide accurate accounting guidance."
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
      console.error('OpenAI GAAP analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown GAAP analysis error';
      throw new Error(`GAAP analysis failed: ${errorMessage}`);
    }
  }

  /**
   * Log processing steps for audit trail
   */
  private async logProcessingStep(
    invoiceId: number, 
    step: string, 
    status: string, 
    details: any
  ) {
    await db.insert(processingLogs).values({
      invoiceId,
      step,
      status,
      details,
    });
  }

  /**
   * Get processing status for an invoice
   */
  async getProcessingStatus(invoiceId: number) {
    const invoice = await db.select().from(invoices).where(eq(invoices.id, invoiceId));
    const logs = await db.select().from(processingLogs).where(eq(processingLogs.invoiceId, invoiceId));
    
    return {
      invoice: invoice[0],
      logs: logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    };
  }

  /**
   * Get all invoices with processing status
   */
  async getAllInvoices() {
    return await db.select().from(invoices).orderBy(invoices.createdAt);
  }
} 