import React, { createContext, useContext, useState, useCallback } from "react";

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  setLoading: (loading: boolean, text?: string) => void;
  startLoading: (text?: string) => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");

  const setLoading = useCallback((loading: boolean, text = "Loading...") => {
    setIsLoading(loading);
    setLoadingText(text);
  }, []);

  const startLoading = useCallback((text = "Loading...") => {
    setLoading(true, text);
  }, [setLoading]);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, loadingText, setLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}
