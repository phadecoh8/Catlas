import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/header";
import { AppBottomNav } from "@/components/layout/bottom-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-layout">
      <AppHeader />
      <div className="app-route-content">{children}</div>
      <AppBottomNav />
    </div>
  );
}
