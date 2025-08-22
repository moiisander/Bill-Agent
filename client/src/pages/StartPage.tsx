import { trpc } from "../utils/trpc";

export default function StartPage() {
  const { data, error, isLoading } = trpc.voucher.list.useQuery()

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground mb-6">New Voucher</h1>
      
      <div className="rounded-lg border bg-card p-6 mb-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">Create New Voucher</h2>
        <p className="text-muted-foreground mb-4">
          Fill out the form below to create a new voucher entry.
        </p>
        
        {/* Placeholder for voucher form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Voucher Number
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                placeholder="Enter voucher number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date
              </label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea 
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              rows={3}
              placeholder="Enter voucher description"
            />
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Create Voucher
          </button>
        </div>
      </div>
      
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          Error loading data
        </div>
      )}
      
      {isLoading && (
        <div className="rounded-lg border bg-muted p-4 text-muted-foreground">
          Loading...
        </div>
      )}
      
      {data && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Recent Vouchers</h2>
          {data[1] ? (
            <div className="space-y-2">
              <p><strong>Latest Voucher:</strong> {data[1].voucherNumber || "No voucher number"}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No recent vouchers available</p>
          )}
        </div>
      )}
    </div>
  );
}