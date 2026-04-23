import { useState } from "react";
import { LogOut, ChevronDown, User } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useAuthStore } from "@/features/auth";
import { useLogout } from "@/features/auth";

export function AdminHeader() {
  const { user } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      {/* Left: page title placeholder */}
      <div />

      {/* Right: profile dropdown */}
      <div className="relative">
        <button
          id="admin-profile-btn"
          onClick={() => setDropdownOpen((o) => !o)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
            "text-foreground hover:bg-muted transition-colors",
          )}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="h-4 w-4 text-primary-600" />
          </div>
          <span className="hidden sm:block max-w-[160px] truncate">{user?.name}</span>
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
            <div className="absolute right-0 mt-2 w-52 bg-popover border border-border rounded-lg shadow-lg z-20 py-1">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <button
                id="admin-logout-btn"
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
