import type { ReactNode } from "react";
import { createContext, useState, useContext } from "react";
import type { InitialLoadingState, LoadingContextType } from "../../types";

const initialState: InitialLoadingState = {
  loading: true,
  tweetLoading: true,
};

export const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<InitialLoadingState>(initialState);

  function toggleLoading(value: boolean) {
    setIsLoading({ ...isLoading, loading: value });
  }

  function toggleTweetLoading(value: boolean) {
    setIsLoading({ ...isLoading, tweetLoading: value });
  }

  return (
    <LoadingContext.Provider
      value={{ loading: isLoading, toggleLoading, toggleTweetLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  return useContext(LoadingContext);
}
