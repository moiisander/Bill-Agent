import { trpc } from "../utils/trpc";

export default function HistoryPage() {
  const { data, error, isLoading } = trpc.voucher.list.useQuery()

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground mb-6">Voucher History</h1>
      
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error loading voucher history
        </div>
      )}
      
      {isLoading && (
        <div className="rounded-lg border bg-muted p-4 text-muted-foreground">
          Loading voucher history...
        </div>
      )}
      
      {data && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Voucher History</h2>
          {data.length > 0 ? (
            <div className="space-y-4">
              {data.map((voucher, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Voucher #{voucher.voucherNumber || `V-${index + 1}`}</p>
                    <p className="text-sm text-muted-foreground">Created on {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Status: Active</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No voucher history available</p>
          )}
        </div>
      )}
    </div>
  );
} 