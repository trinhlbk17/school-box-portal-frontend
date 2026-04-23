import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({ title = "Something went wrong", message, onRetry }: ErrorAlertProps) {
  return (
    <div className="rounded-lg bg-error-50 p-4 border border-error-200">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-error-500" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <div>
            <h3 className="text-sm font-medium text-error-800">{title}</h3>
            <div className="mt-2 text-sm text-error-700">
              <p>{message}</p>
            </div>
          </div>
          {onRetry && (
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="bg-white hover:bg-error-50 text-error-700 border-error-200"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
