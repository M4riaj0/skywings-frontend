'use client';

import { useContext, createContext, useState } from "react";

interface FinanceDrawerContextType {
  isOpen: boolean;
  toggleDrawer: () => void;
}

const FinanceDrawerContext = createContext<FinanceDrawerContextType | undefined>(undefined);

export const useFinanceDrawer = () => {
  const context = useContext(FinanceDrawerContext);
  if (!context) {
    throw new Error("useFinanceDrawer must be used within a FinanceDrawerProvider");
  }
  return context;
};

export const FinanceDrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <FinanceDrawerContext.Provider value={{ isOpen, toggleDrawer }}>
      {children}
    </FinanceDrawerContext.Provider>
  );
};