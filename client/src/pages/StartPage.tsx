import { useState } from "react";
import { InvoiceUploadForm } from "../components/invoice/InvoiceUploadForm";
import { GeneratedVoucher } from "../components/invoice/GeneratedVoucher";
import { ProcessingStatus } from "../components/invoice/ProcessingStatus";
import { ExistingVouchers } from "../components/invoice/ExistingVouchers";

interface ProcessedInvoiceData {
  file: {
    id: number;
    fileName: string;
    uploadedAt: string;
  };
  invoice: {
    id: number;
    vendorName: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    lineItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      amount: number;
    }>;
  };
  voucher: {
    id: number;
    accountClassification: string;
    expenseCategory: string;
    taxTreatment: string;
    voucherLines: Array<{
      accountCode: string;
      description: string;
      debit: number;
      credit: number;
    }>;
  };
}

export default function StartPage() {
  const [processedData, setProcessedData] = useState<ProcessedInvoiceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInvoiceProcessed = (data: ProcessedInvoiceData) => {
    setProcessedData(data);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    if (errorMessage) {
      setProcessedData(null);
    }
  };

  const handleProcessingStart = () => {
    setIsProcessing(true);
  };

  const handleProcessingEnd = () => {
    setIsProcessing(false);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Invoice Processing
      </h1>

      {/* Invoice Upload Form */}
      <InvoiceUploadForm
        onInvoiceProcessed={handleInvoiceProcessed}
        onError={handleError}
        onProcessingStart={handleProcessingStart}
        onProcessingEnd={handleProcessingEnd}
      />

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive rounded-md mb-6">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Processing Status */}
      <ProcessingStatus isProcessing={isProcessing} />

      {/* Generated Voucher */}
      {processedData && (
        <GeneratedVoucher 
          invoiceData={processedData.invoice}
          voucherData={processedData.voucher}
          fileData={processedData.file}
        />
      )}

      {/* Existing Vouchers */}
      <ExistingVouchers />
    </div>
  );
}
