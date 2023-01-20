import { createContext, useState, ReactNode, useContext } from "react";

type LoadingContextType = {
  loading: typeof initialState;
  toggleLoading: (value: boolean) => void;
  toggleTweetLoading: (value: boolean) => void;
};

const initialState = {
  loading: true,
  tweetLoading: true,
};

export const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<typeof initialState>(initialState);

  function toggleLoading(value: boolean) {
    setIsLoading({ ...isLoading, loading: value });
  }

  function toggleTweetLoading(value: boolean) {
    setIsLoading({ ...isLoading, tweetLoading: value });
  }

  return (
    <LoadingContext.Provider value={{ loading: isLoading, toggleLoading, toggleTweetLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  return useContext(LoadingContext);
}
