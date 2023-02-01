import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import type { ToggleStateType, ToggleContextType } from "../../types";

const initialState: ToggleStateType = {
  isNewTweetOpen: false,
  isNewCommentOpen: false,
  isSingleTweetOpen: false,
  isKeyPromptOpen: false,
  isInvalidKeyOpen: false,
  isMessageOpen: false,
};

const ToggleContext = createContext<ToggleContextType | null>(null);

export function ToggleProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<ToggleStateType>(initialState);

  function toggleNewTweet() {
    setIsOpen({
      ...isOpen,
      isNewTweetOpen: !isOpen.isNewTweetOpen,
      isNewCommentOpen: isOpen.isNewCommentOpen
        ? false
        : isOpen.isNewCommentOpen,
    });
  }

  function closeNewTweet() {
    setIsOpen((prev) => ({
      ...prev,
      isNewTweetOpen: false,
      isNewCommentOpen: false,
    }));
  }

  function toggleNewComment() {
    setIsOpen((prev) => ({
      ...isOpen,
      isNewTweetOpen: isOpen.isNewTweetOpen ? false : isOpen.isNewTweetOpen,
      isNewCommentOpen: !isOpen.isNewCommentOpen,
    }));
  }

  function toggleSingleTweet(value: boolean) {
    setIsOpen((prev) => ({
      ...isOpen,
      isSingleTweetOpen: value ?? !isOpen.isSingleTweetOpen,
    }));
  }

  function toggleKeyPrompt(value: boolean) {
    setIsOpen((prev) => ({
      ...prev,
      isKeyPromptOpen: value ?? !isOpen.isKeyPromptOpen,
    }));
  }

  function toggleIsInvalidKey(value: boolean) {
    setIsOpen((prev) => ({
      ...prev,
      isInvalidKeyOpen: value ?? !prev.isInvalidKeyOpen,
    }));
  }

  function toggleMessage(value: boolean) {
    setIsOpen((prev) => ({
      ...prev,
      isMessageOpen: value ?? !prev.isMessageOpen,
    }));
  }

  return (
    <ToggleContext.Provider
      value={{
        isOpen,
        toggleNewTweet,
        closeNewTweet,
        toggleNewComment,
        toggleSingleTweet,
        toggleKeyPrompt,
        toggleIsInvalidKey,
        toggleMessage,
      }}
    >
      {children}
    </ToggleContext.Provider>
  );
}

export function useToggleContext() {
  return useContext(ToggleContext);
}
