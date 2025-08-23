import { trpc } from "../../utils/trpc";

export default function HistoryPage() {
    const { data, error, isLoading } = trpc.voucher.list.useQuery();

    const formatCurrency = (value: string | null): string => {
        if (!value) return "$0.00";
        const num = parseFloat(value);
        return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
    };

    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold text-foreground mb-6">
                Invoice & Voucher History
            </h1>

            {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
                    Error loading invoice history
                </div>
            )}

            {isLoading && (
                <div className="rounded-lg border bg-muted p-4 text-muted-foreground">
                    Loading invoice history...
                </div>
            )}

            {data && (
                <div className="rounded-lg border bg-card p-6">
                    <h2 className="text-xl font-semibold text-card-foreground mb-4">
                        Recent Invoices
                    </h2>
                    {data.length > 0 ? (
                        <div className="space-y-4">
                            {data.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="p-4 border rounded-lg"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="font-medium text-lg">
                                                {invoice.invoiceNumber ||
                                                    `Invoice #${invoice.id}`}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Vendor: {invoice.vendorName}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-lg">
                                                {formatCurrency(
                                                    invoice.totalAmount
                                                )}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {invoice.invoiceDate
                                                    ? new Date(
                                                          invoice.invoiceDate
                                                      ).toLocaleDateString()
                                                    : "Date N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    {invoice.lineItems &&
                                        invoice.lineItems.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-sm font-medium text-muted-foreground mb-2">
                                                    Line Items:
                                                </p>
                                                <div className="space-y-1">
                                                    {invoice.lineItems
                                                        .slice(0, 3)
                                                        .map((item, index) => (
                                                            <div
                                                                key={index}
                                                                className="text-sm text-muted-foreground"
                                                            >
                                                                •{" "}
                                                                {
                                                                    item.description
                                                                }{" "}
                                                                -{" "}
                                                                {formatCurrency(
                                                                    item.amount
                                                                )}
                                                            </div>
                                                        ))}
                                                    {invoice.lineItems.length >
                                                        3 && (
                                                        <p className="text-xs text-muted-foreground">
                                                            +
                                                            {invoice.lineItems
                                                                .length -
                                                                3}{" "}
                                                            more items
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex space-x-4">
                                            <span>
                                                Subtotal:{" "}
                                                {formatCurrency(
                                                    invoice.subtotal
                                                )}
                                            </span>
                                            <span>
                                                Tax:{" "}
                                                {formatCurrency(
                                                    invoice.taxAmount
                                                )}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            {invoice.voucher ? (
                                                <span className="text-green-600 font-medium">
                                                    ✓ Voucher Created
                                                </span>
                                            ) : (
                                                <span className="text-yellow-600 font-medium">
                                                    Processing...
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {invoice.voucher && (
                                        <div className="mt-3 pt-3 border-t">
                                            <p className="text-sm font-medium text-muted-foreground mb-2">
                                                Voucher Details:
                                            </p>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Category:
                                                    </span>
                                                    <p className="font-medium">
                                                        {
                                                            invoice.voucher
                                                                .expenseCategory
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Classification:
                                                    </span>
                                                    <p className="font-medium">
                                                        {
                                                            invoice.voucher
                                                                .accountClassification
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Tax Treatment:
                                                    </span>
                                                    <p className="font-medium">
                                                        {
                                                            invoice.voucher
                                                                .taxTreatment
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">
                            No invoice history available
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
