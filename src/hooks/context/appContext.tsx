import { Tweet } from "@prisma/client";
import type { ReactNode } from "react";
import { createContext, useState, useContext } from "react";

type AppStateType = {
  generatedTweet: string;
  generatedComment: string;
  selectedTweet: Tweet | null;
};

type AppContextType = {
  appState: AppStateType;
  setGeneratedTweet: (tweet: string) => void;
  setGeneratedComment: (comment: string) => void;
};

type AppComponentProps = {
  children: ReactNode;
};

const initialState = {
  generatedTweet: "",
  generatedComment: "",
  selectedTweet: null,
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: AppComponentProps) {
  const [appState, setAppState] = useState<AppStateType>(initialState);

  function setGeneratedTweet(tweet: string) {
    setAppState({
      ...appState,
      generatedTweet: tweet,
    });
  }

  function setGeneratedComment(comment: string) {
    setAppState({
      ...appState,
      generatedComment: comment,
    });
  }

  return (
    <AppContext.Provider
      value={{ appState, setGeneratedTweet, setGeneratedComment }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
