import { useState } from "react";
import { InvoiceUploadForm } from "./invoice-upload-form";
import { VoucherCard } from "../../components/voucher-card";
import { ProcessingStatus } from "./processing-status";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "../../../../server/src/trpc/router";
import { InvoiceCard } from "@/components/invoice-card";

export type ProcessedInvoiceData = inferProcedureOutput<
    AppRouter["voucher"]["processInvoice"]
>;

export default function StartPage() {
    const [processedData, setProcessedData] =
        useState<ProcessedInvoiceData | null>(null);
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
        <div className="max-w-4xl p-4">
            <h1 className="text-3xl font-bold text-foreground mb-6">
                Invoice Processing
            </h1>
            <InvoiceUploadForm
                onInvoiceProcessed={handleInvoiceProcessed}
                onError={handleError}
                onProcessingStart={handleProcessingStart}
                onProcessingEnd={handleProcessingEnd}
            />
            {error && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded-md mb-6">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}
            <ProcessingStatus isProcessing={isProcessing} />
            {processedData && (
                <>
                    <VoucherCard voucherData={processedData.voucher} />
                    <InvoiceCard
                        invoiceData={processedData.invoice}
                        fileData={processedData.file}
                    />
                </>
            )}
        </div>
    );
}
