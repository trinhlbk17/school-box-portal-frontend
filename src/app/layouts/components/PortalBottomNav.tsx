import { NavLink } from "react-router-dom";
import { Home, Users, User } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useAuthStore } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";
import { ROLES } from "@/shared/constants/roles";

interface BottomNavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  protectorOnly?: boolean;
}

const NAV_ITEMS: BottomNavItem[] = [
  { label: "Home", to: ROUTES.PORTAL.ROOT, icon: Home },
  { label: "My Students", to: ROUTES.PORTAL.STUDENTS, icon: Users, protectorOnly: true },
  { label: "Profile", to: ROUTES.PORTAL.PROFILE, icon: User },
];

export function PortalBottomNav() {
  const { user } = useAuthStore();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.protectorOnly || user?.role === ROLES.PROTECTOR,
  );

  return (
    <nav className="h-16 border-t border-border bg-card flex items-center justify-around px-2 shrink-0">
      {visibleItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === ROUTES.PORTAL.ROOT}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-xs font-medium transition-colors",
              isActive
                ? "text-primary-600"
                : "text-muted-foreground hover:text-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={cn("h-5 w-5", isActive && "text-primary-600")} />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
