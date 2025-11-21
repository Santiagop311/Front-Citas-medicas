import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardContextType {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (value: boolean) => void;
  
}

const DashboardContext = createContext<DashboardContextType>({} as any);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const value = {
    isSidebarExpanded,
    setIsSidebarExpanded,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context || Object.keys(context).length === 0) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}

export default DashboardContext;
