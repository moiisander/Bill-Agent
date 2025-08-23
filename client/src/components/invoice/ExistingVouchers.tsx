import { trpc } from "../../utils/trpc";

export function ExistingVouchers() {
  const { data: existingInvoices, error: invoiceError, isLoading: invoiceLoading } = trpc.voucher.list.useQuery();

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-xl font-semibold text-card-foreground mb-4">Recent Invoices</h2>
      
      {invoiceError && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error loading invoices
        </div>
      )}
      
      {invoiceLoading && (
        <div className="rounded-lg border bg-muted p-4 text-muted-foreground">
          Loading invoices...
        </div>
      )}
      
      {existingInvoices && existingInvoices.length > 0 ? (
        <div className="space-y-2">
          {existingInvoices.slice(0, 5).map((invoice) => (
            <div key={invoice.id} className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">{invoice.invoiceNumber || `Invoice #${invoice.id}`}</p>
                <p className="text-sm text-muted-foreground">{invoice.vendorName}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${invoice.totalAmount}</p>
                <p className="text-sm text-muted-foreground">
                  {invoice.voucher ? 'Voucher Created' : 'Processing'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No invoices available</p>
      )}
    </div>
  );
} 