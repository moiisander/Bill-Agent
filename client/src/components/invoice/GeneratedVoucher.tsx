interface InvoiceData {
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
}

interface VoucherData {
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
}

interface FileData {
  id: number;
  fileName: string;
  uploadedAt: string;
}

interface GeneratedVoucherProps {
  invoiceData: InvoiceData;
  voucherData: VoucherData;
  fileData: FileData;
}

export function GeneratedVoucher({ invoiceData, voucherData, fileData }: GeneratedVoucherProps) {
  return (
    <div className="rounded-lg border bg-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-card-foreground">Processed Invoice & Voucher</h2>
        <span className="text-sm text-muted-foreground">
          File: {fileData.fileName}
        </span>
      </div>
      
      {/* Invoice Information */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-card-foreground mb-3">Invoice Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Invoice Number</label>
            <p className="text-foreground font-semibold">{invoiceData.invoiceNumber}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Vendor</label>
            <p className="text-foreground">{invoiceData.vendorName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Invoice Date</label>
            <p className="text-foreground">{invoiceData.invoiceDate}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Due Date</label>
            <p className="text-foreground">{invoiceData.dueDate}</p>
          </div>
        </div>

        {invoiceData.lineItems && invoiceData.lineItems.length > 0 && (
          <div className="mb-4">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Line Items</label>
            <div className="space-y-2">
              {invoiceData.lineItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm p-2 bg-muted rounded">
                  <div className="flex-1">
                    <span className="font-medium">{item.description}</span>
                    <span className="text-muted-foreground ml-2">
                      Qty: {item.quantity} × ${item.unitPrice}
                    </span>
                  </div>
                  <span className="font-semibold">${item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Subtotal</label>
            <p className="text-foreground">${invoiceData.subtotal.toFixed(2)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tax</label>
            <p className="text-foreground">${invoiceData.taxAmount.toFixed(2)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Total</label>
            <p className="text-foreground font-semibold">${invoiceData.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Voucher Information */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-card-foreground mb-3">Voucher Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Account Classification</label>
            <p className="text-foreground">{voucherData.accountClassification}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Expense Category</label>
            <p className="text-foreground">{voucherData.expenseCategory}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tax Treatment</label>
            <p className="text-foreground">{voucherData.taxTreatment}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Voucher ID</label>
            <p className="text-foreground">#{voucherData.id}</p>
          </div>
        </div>

        {voucherData.voucherLines && voucherData.voucherLines.length > 0 && (
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Voucher Lines</label>
            <div className="space-y-2">
              {voucherData.voucherLines.map((line, index) => (
                <div key={index} className="flex justify-between text-sm p-2 bg-muted rounded">
                  <div className="flex-1">
                    <span className="font-medium">{line.description}</span>
                    <span className="text-muted-foreground ml-2">({line.accountCode})</span>
                  </div>
                  <div className="text-right">
                    {line.debit > 0 && <span className="text-red-600">Dr: ${line.debit.toFixed(2)}</span>}
                    {line.credit > 0 && <span className="text-green-600">Cr: ${line.credit.toFixed(2)}</span>}
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
        <p>Uploaded: {new Date(fileData.uploadedAt).toLocaleString()}</p>
      </div>
    </div>
  );
} 