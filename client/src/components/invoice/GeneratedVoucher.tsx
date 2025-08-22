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

interface GeneratedVoucherProps {
  voucher: VoucherData;
  ocrConfidence: number;
}

export function GeneratedVoucher({ voucher, ocrConfidence }: GeneratedVoucherProps) {
  return (
    <div className="rounded-lg border bg-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-card-foreground">Generated Voucher</h2>
        <span className="text-sm text-muted-foreground">
          OCR Confidence: {(ocrConfidence * 100).toFixed(1)}%
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Voucher Number</label>
          <p className="text-foreground font-semibold">{voucher.voucherNumber}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Date</label>
          <p className="text-foreground">{voucher.date}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Vendor</label>
          <p className="text-foreground">{voucher.vendor}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
          <p className="text-foreground font-semibold">${voucher.amount.toFixed(2)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Account Code</label>
          <p className="text-foreground">{voucher.accountCode}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Category</label>
          <p className="text-foreground">{voucher.expenseCategory}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-muted-foreground">Description</label>
        <p className="text-foreground">{voucher.description}</p>
      </div>

      {voucher.lineItems && voucher.lineItems.length > 0 && (
        <div className="mb-4">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Line Items</label>
          <div className="space-y-2">
            {voucher.lineItems.map((item, index) => (
              <div key={index} className="flex justify-between text-sm p-2 bg-muted rounded">
                <span>{item.description}</span>
                <span>${item.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Subtotal</label>
          <p className="text-foreground">${voucher.subtotal.toFixed(2)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Tax</label>
          <p className="text-foreground">${voucher.taxAmount.toFixed(2)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Total</label>
          <p className="text-foreground font-semibold">${voucher.amount.toFixed(2)}</p>
        </div>
      </div>

      {voucher.notes && (
        <div>
          <label className="text-sm font-medium text-muted-foreground">Notes</label>
          <p className="text-foreground text-sm">{voucher.notes}</p>
        </div>
      )}
    </div>
  );
} 