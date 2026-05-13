import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

export function ServerErrorPage({ error: propError }: { error?: Error | unknown }) {
  const routeError = useRouteError();
  const error = propError || routeError;
  
  let errorMessage = "An unexpected error occurred.";
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="size-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="size-10 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground text-sm">
            {errorMessage}
          </p>
        </div>
        
        {import.meta.env.DEV && error instanceof Error && error.stack && (
          <div className="text-left bg-muted/50 p-4 rounded-lg overflow-auto max-h-48 text-xs font-mono border border-border">
            <pre className="text-destructive/80">{error.stack}</pre>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto gap-2"
          >
            <RotateCcw className="size-4" />
            Try Again
          </Button>
          <Link to={ROUTES.LOGIN} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto gap-2">
              <Home className="size-4" />
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
