import { ErrorBoundary } from "react-error-boundary";
import type { FallbackProps } from "react-error-boundary";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

interface FeatureErrorBoundaryProps {
  children: React.ReactNode;
  featureName?: string;
}

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-destructive/10 rounded-lg border border-destructive/20 text-center space-y-4 m-4">
      <AlertCircle className="size-10 text-destructive" />
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-destructive">
          Something went wrong
        </h3>
        <p className="text-sm text-destructive/80 max-w-sm">
          We couldn't load this section. You can try reloading it.
        </p>
      </div>
      {/* Show error message in dev mode */}
      {import.meta.env.DEV && (
        <pre className="text-xs text-left w-full overflow-auto bg-destructive/20 p-3 rounded text-destructive mt-2 max-h-40">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      )}
      <Button
        variant="outline"
        onClick={resetErrorBoundary}
        className="mt-4 gap-2"
      >
        <RefreshCw className="size-4" />
        Try again
      </Button>
    </div>
  );
};

export const FeatureErrorBoundary = ({ children }: FeatureErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Optional: Perform any cleanup or resetting of state if needed
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
