import type { Tweet } from "@prisma/client";
import { createContext, useState, useContext } from "react";
import type {
  AppContextType,
  AppStateType,
  AppComponentProps,
} from "../../types";

const initialState = {
  generatedTweet: "",
  generatedComment: "",
  selectedTweet: null,
  message: "",
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: AppComponentProps) {
  const [appState, setAppState] = useState<AppStateType>(initialState);

  function setGeneratedTweet(tweet: string) {
    setAppState((prev) => ({
      ...prev,
      generatedTweet: tweet,
    }));
  }

  function setGeneratedComment(comment: string) {
    setAppState((prev) => ({
      ...prev,
      generatedComment: comment,
    }));
  }

  function setSelectedTweet(tweet: Tweet) {
    setAppState((prev) => ({
      ...prev,
      selectedTweet: tweet,
    }));
  }

  function setMessage(message: string) {
    setAppState((prev) => ({
      ...prev,
      message: message,
    }));
  }

  return (
    <AppContext.Provider
      value={{
        appState,
        setGeneratedTweet,
        setGeneratedComment,
        setSelectedTweet,
        setMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
