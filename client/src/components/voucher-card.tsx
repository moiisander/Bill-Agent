import type { ProcessedInvoiceData } from "@/pages/start";

type ProcessedInvoiceVoucher = ProcessedInvoiceData["voucher"];

interface VoucherCardProps {
    voucherData: ProcessedInvoiceVoucher;
}

export function VoucherCard({ voucherData }: VoucherCardProps) {
    const formatCurrency = (value: string | null): string => {
        if (!value) return "$0.00";
        const num = parseFloat(value);
        return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
    };

    return (
        <div className="rounded-lg border bg-card p-6">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-card-foreground mb-3">
                    Voucher #{voucherData.voucherNumber}
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Issue Date
                        </label>
                        <p className="text-foreground">
                            {voucherData.issueDate}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Due Date
                        </label>
                        <p className="text-foreground">
                            {voucherData.dueDate}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Vendor
                        </label>
                        <p className="text-foreground">
                            {voucherData.vendorName}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Vendor Address
                        </label>
                        <p className="text-foreground">
                            {voucherData.vendorAddress}
                        </p>
                    </div>
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
                            Invoice Number
                        </label>
                        <p className="text-foreground">
                            {voucherData.invoiceNumber}
                        </p>
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
        </div>
    );
}
