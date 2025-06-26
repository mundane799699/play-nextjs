"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface DashboardContextType {
  onAIChatToggle?: () => void;
  isAIChatOpen?: boolean;
}

const DashboardContext = createContext<DashboardContextType>({});

export const useDashboard = () => {
  return useContext(DashboardContext);
};

interface DashboardProviderProps {
  children: ReactNode;
  onAIChatToggle?: () => void;
  isAIChatOpen?: boolean;
}

export const DashboardProvider = ({ 
  children, 
  onAIChatToggle, 
  isAIChatOpen 
}: DashboardProviderProps) => {
  return (
    <DashboardContext.Provider value={{ onAIChatToggle, isAIChatOpen }}>
      {children}
    </DashboardContext.Provider>
  );
}; 