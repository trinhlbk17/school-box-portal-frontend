import { useState } from "react";
import { BookOpen, ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useAuthStore } from "@/features/auth";
import { useLogout } from "@/features/auth/hooks/useLogout";

export function PortalTopBar() {
  const { user } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-sm text-foreground">School Box Portal</span>
      </div>

      {/* Right: profile dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-medium",
            "text-foreground hover:bg-muted transition-colors",
          )}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-xs font-bold text-primary-700">
              {user?.name?.charAt(0).toUpperCase() ?? "?"}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>

        {dropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
              aria-hidden="true"
            />
            {/* Dropdown panel */}
            <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-20 py-1">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { setDropdownOpen(false); logout(); }}
                disabled={isPending}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-error-700 hover:bg-error-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {isPending ? "Logging out…" : "Logout"}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
