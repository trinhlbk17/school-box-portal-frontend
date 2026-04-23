import { BookOpen } from "lucide-react";
import { useAuthStore } from "@/features/auth";

export function PortalTopBar() {
  const { user } = useAuthStore();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-sm text-foreground">School Box Portal</span>
      </div>

      {/* User avatar */}
      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
        <span className="text-xs font-bold text-primary-700">
          {user?.name?.charAt(0).toUpperCase() ?? "?"}
        </span>
      </div>
    </header>
  );
}
