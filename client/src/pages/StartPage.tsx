import { useState } from "react";
import { InvoiceUploadForm } from "../components/invoice/InvoiceUploadForm";
import { GeneratedVoucher } from "../components/invoice/GeneratedVoucher";
import { ExistingVouchers } from "../components/invoice/ExistingVouchers";
import { ProcessingStatus } from "../components/invoice/ProcessingStatus";

interface VoucherData {
  voucherNumber: string;
  date: string;
  vendor: string;
  amount: number;
  description: string;
  accountCode: string;
  expenseCategory: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  taxAmount: number;
  subtotal: number;
  notes: string;
}

export default function StartPage() {
  const [voucher, setVoucher] = useState<VoucherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoucherGenerated = (
    voucherData: VoucherData,
    confidence: number
  ) => {
    setVoucher(voucherData);
    setOcrConfidence(confidence);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    if (errorMessage) {
      setVoucher(null);
      setOcrConfidence(null);
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
        onVoucherGenerated={handleVoucherGenerated}
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
      {voucher && ocrConfidence && (
        <GeneratedVoucher voucher={voucher} ocrConfidence={ocrConfidence} />
      )}

      {/* Existing Vouchers */}
      <ExistingVouchers />
    </div>
  );
}
