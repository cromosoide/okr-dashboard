'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useDashboard } from '@/hooks/useDashboard';

type DashboardContextType = ReturnType<typeof useDashboard>;
const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const dashboard = useDashboard();
  return <DashboardContext.Provider value={dashboard}>{children}</DashboardContext.Provider>;
}

export function useDashboardContext() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboardContext must be used inside DashboardProvider');
  return ctx;
}
