import { useState } from "react";
import { trpc } from "../../utils/trpc";

interface InvoiceUploadFormProps {
  onVoucherGenerated: (voucher: any, ocrConfidence: number) => void;
  onError: (error: string) => void;
  onProcessingStart: () => void;
  onProcessingEnd: () => void;
}

export function InvoiceUploadForm({ 
  onVoucherGenerated, 
  onError, 
  onProcessingStart, 
  onProcessingEnd 
}: InvoiceUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const processInvoiceMutation = trpc.invoice.processInvoice.useMutation({
    onSuccess: (data) => {
      if (data.success && data.voucher) {
        onVoucherGenerated(data.voucher, data.ocrConfidence);
        setSelectedFile(null); // Reset file input
      }
    },
    onError: (error) => {
      onError(error.message);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        onError('Please select a JPEG, PNG, or JPG image file.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        onError('File size must be less than 5MB.');
        return;
      }

      setSelectedFile(file);
      onError(''); // Clear any previous errors
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      onError('Please select a file first.');
      return;
    }

    onProcessingStart();
    onError('');

    try {
      // Convert file to base64
      const base64Data = await fileToBase64(selectedFile);
      
      // Process invoice using tRPC
      await processInvoiceMutation.mutateAsync({
        fileData: base64Data,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      });

    } catch (err) {
      onError(err instanceof Error ? err.message : 'An error occurred during processing');
    } finally {
      onProcessingEnd();
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data:image/jpeg;base64, prefix
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="rounded-lg border bg-card p-6 mb-6">
      <h2 className="text-xl font-semibold text-card-foreground mb-4">Upload Invoice Image</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Select Invoice Image
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileSelect}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            disabled={processInvoiceMutation.isPending}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Supported formats: JPEG, PNG, JPG (max 5MB)
          </p>
        </div>

        {selectedFile && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-foreground">
              <strong>Selected file:</strong> {selectedFile.name} 
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedFile || processInvoiceMutation.isPending}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processInvoiceMutation.isPending ? 'Processing...' : 'Process Invoice'}
        </button>
      </form>
    </div>
  );
} 