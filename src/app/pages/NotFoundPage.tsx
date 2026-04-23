import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="text-7xl font-black text-primary-200 select-none">404</div>
        <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
        <p className="text-muted-foreground text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Go to login
        </Link>
      </div>
    </div>
  );
}
