// src/contexts/DashboardContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardContextType {
  // Estado del sidebar
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (value: boolean) => void;
  
  // Aquí puedes añadir más estados que necesites en el futuro
  // Por ejemplo:
  // theme: 'light' | 'dark';
  // setTheme: (theme: 'light' | 'dark') => void;
}

const DashboardContext = createContext<DashboardContextType>({} as any);

// Provider component
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const value = {
    isSidebarExpanded,
    setIsSidebarExpanded,
    // Añade más estados aquí según necesites
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// Custom hook para usar el context
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context || Object.keys(context).length === 0) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}

export default DashboardContext;
