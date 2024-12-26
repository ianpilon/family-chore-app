import React from 'react';
import { AppContext } from './AppContext';
import { useAppState } from '../hooks/useAppState';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const value = useAppState();

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}