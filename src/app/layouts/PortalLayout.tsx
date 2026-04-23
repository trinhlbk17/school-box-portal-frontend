import { Outlet } from "react-router-dom";
import { PortalTopBar } from "./components/PortalTopBar";
import { PortalBottomNav } from "./components/PortalBottomNav";

/**
 * Portal layout: top bar + scrollable content area + bottom navigation.
 */
export function PortalLayout() {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <PortalTopBar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 max-w-2xl mx-auto">
          <Outlet />
        </div>
      </main>

      <PortalBottomNav />
    </div>
  );
}
