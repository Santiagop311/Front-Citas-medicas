// src/components/DashboardLayout.tsx
import React from "react";
import { useDashboard } from "./dashboardContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isSidebarExpanded } = useDashboard();

  return (
    <div 
      className={`min-h-screen transition-all duration-300 ${
        isSidebarExpanded ? 'lg:ml-64' : 'lg:ml-20'
      }`}
    >
      {children}
    </div>
  );
}

export default DashboardLayout;