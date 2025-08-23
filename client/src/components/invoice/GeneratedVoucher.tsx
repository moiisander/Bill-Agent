import type { ProcessedInvoiceData } from "@/pages/StartPage";

interface GeneratedVoucherProps {
    processedInvoiceData: ProcessedInvoiceData;
}

export function GeneratedVoucher({
    processedInvoiceData,
}: GeneratedVoucherProps) {
    const fileData = processedInvoiceData.file;
    const invoiceData = processedInvoiceData.invoice;
    const voucherData = processedInvoiceData.voucher;

    const formatCurrency = (value: string | null): string => {
        if (!value) return "$0.00";
        const num = parseFloat(value);
        return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
    };

    return (
        <div className="rounded-lg border bg-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-card-foreground">
                    Processed Invoice & Voucher
                </h2>
                <span className="text-sm text-muted-foreground">
                    File: {fileData.fileName}
                </span>
            </div>

            {/* Invoice Information */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-card-foreground mb-3">
                    Invoice Details
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Invoice Number
                        </label>
                        <p className="text-foreground font-semibold">
                            {invoiceData.invoiceNumber}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Vendor
                        </label>
                        <p className="text-foreground">
                            {invoiceData.vendorName}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Invoice Date
                        </label>
                        <p className="text-foreground">
                            {invoiceData.invoiceDate || "N/A"}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Due Date
                        </label>
                        <p className="text-foreground">
                            {invoiceData.dueDate || "N/A"}
                        </p>
                    </div>
                </div>

                {invoiceData.lineItems && invoiceData.lineItems.length > 0 && (
                    <div className="mb-4">
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Line Items
                        </label>
                        <div className="space-y-2">
                            {invoiceData.lineItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between text-sm p-2 bg-muted rounded"
                                >
                                    <div className="flex-1">
                                        <span className="font-medium">
                                            {item.description}
                                        </span>
                                        <span className="text-muted-foreground ml-2">
                                            Qty: {item.quantity} ×{" "}
                                            {formatCurrency(item.unitPrice)}
                                        </span>
                                    </div>
                                    <span className="font-semibold">
                                        {formatCurrency(item.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Subtotal
                        </label>
                        <p className="text-foreground">
                            {formatCurrency(invoiceData.subtotal)}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Tax
                        </label>
                        <p className="text-foreground">
                            {formatCurrency(invoiceData.taxAmount)}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Total
                        </label>
                        <p className="text-foreground font-semibold">
                            {formatCurrency(invoiceData.totalAmount)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Voucher Information */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-card-foreground mb-3">
                    Voucher Details
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Account Classification
                        </label>
                        <p className="text-foreground">
                            {voucherData.accountClassification}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Expense Category
                        </label>
                        <p className="text-foreground">
                            {voucherData.expenseCategory}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Tax Treatment
                        </label>
                        <p className="text-foreground">
                            {voucherData.taxTreatment}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Voucher ID
                        </label>
                        <p className="text-foreground">#{voucherData.id}</p>
                    </div>
                </div>

                {voucherData.lineItems && voucherData.lineItems.length > 0 && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Voucher Lines
                        </label>
                        <div className="space-y-2">
                            {voucherData.lineItems.map((line, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between text-sm p-2 bg-muted rounded"
                                >
                                    <div className="flex-1">
                                        <span className="font-medium">
                                            {line.description}
                                        </span>
                                        <span className="text-muted-foreground ml-2">
                                            ({line.accountCode})
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        {line.debit &&
                                            parseFloat(line.debit) > 0 && (
                                                <span className="text-red-600">
                                                    Dr:{" "}
                                                    {formatCurrency(line.debit)}
                                                </span>
                                            )}
                                        {line.credit &&
                                            parseFloat(line.credit) > 0 && (
                                                <span className="text-green-600">
                                                    Cr:{" "}
                                                    {formatCurrency(
                                                        line.credit
                                                    )}
                                                </span>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* File Information */}
            <div className="text-xs text-muted-foreground border-t pt-3">
                <p>Processed from: {fileData.fileName}</p>
                <p>
                    Uploaded: {new Date(fileData.uploadedAt).toLocaleString()}
                </p>
            </div>
        </div>
    );
}
