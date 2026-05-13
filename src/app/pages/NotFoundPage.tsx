import { Link } from "react-router-dom";
import { FileQuestion, Home } from "lucide-react";

import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-sm">
        <div className="flex justify-center">
          <div className="size-20 bg-muted/50 rounded-full flex items-center justify-center">
            <FileQuestion className="size-10 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-7xl font-black text-muted select-none">404</h1>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Page not found</h2>
          <p className="text-muted-foreground text-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="pt-4">
          <Link to={ROUTES.LOGIN}>
            <Button className="gap-2">
              <Home className="size-4" />
              Go to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
