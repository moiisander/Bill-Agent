interface ProcessingStatusProps {
  isProcessing: boolean;
}

export function ProcessingStatus({ isProcessing }: ProcessingStatusProps) {
  if (!isProcessing) return null;

  return (
    <div className="rounded-lg border bg-muted p-6 mb-6">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <p className="text-foreground">Processing invoice... This may take a few moments.</p>
      </div>
    </div>
  );
} 