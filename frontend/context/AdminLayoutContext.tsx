'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AdminLayoutContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

export function AdminLayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load sidebar state from localStorage on mount
    const savedState = localStorage.getItem('adminSidebarOpen');
    if (savedState !== null) {
      setSidebarOpen(JSON.parse(savedState));
    }
    setMounted(true);
  }, []);

  const handleSetSidebarOpen = (open: boolean) => {
    setSidebarOpen(open);
    localStorage.setItem('adminSidebarOpen', JSON.stringify(open));
  };

  return (
    <AdminLayoutContext.Provider value={{ sidebarOpen, setSidebarOpen: handleSetSidebarOpen }}>
      {children}
    </AdminLayoutContext.Provider>
  );
}

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (context === undefined) {
    throw new Error('useAdminLayout must be used within AdminLayoutProvider');
  }
  return context;
}
