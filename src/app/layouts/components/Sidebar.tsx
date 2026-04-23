import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  School,
  BookOpen,
  Users,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useAuthStore } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";
import { ROLES } from "@/shared/constants/roles";

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: ROUTES.ADMIN.ROOT, icon: LayoutDashboard },
  { label: "Schools", to: ROUTES.ADMIN.SCHOOLS, icon: School, adminOnly: true },
  { label: "My Classes", to: ROUTES.ADMIN.MY_CLASSES, icon: BookOpen },
  { label: "Users", to: ROUTES.ADMIN.USERS, icon: Users, adminOnly: true },
  { label: "Box Settings", to: ROUTES.ADMIN.SETTINGS_BOX, icon: Settings, adminOnly: true },
  { label: "Audit Logs", to: ROUTES.ADMIN.AUDIT, icon: FileText, adminOnly: true },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuthStore();
  const location = useLocation();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || user?.role === ROLES.ADMIN,
  );

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-200",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo area */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border shrink-0">
        {!collapsed && (
          <span className="font-bold text-base text-sidebar-primary truncate">
            School Box Portal
          </span>
        )}
        {collapsed && (
          <span className="font-bold text-lg text-sidebar-primary mx-auto">SB</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {visibleItems.map((item) => {
          const isActive =
            item.to === ROUTES.ADMIN.ROOT
              ? location.pathname === ROUTES.ADMIN.ROOT
              : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="shrink-0 border-t border-sidebar-border p-2">
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
            collapsed && "justify-center px-2",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
