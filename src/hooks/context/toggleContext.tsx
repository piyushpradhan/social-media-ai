import { createContext, ReactNode, useContext, useState } from "react";

type ToggleStateType = {
  isNewTweetOpen: boolean;
  isNewCommentOpen: boolean;
  isSingleTweetOpen: boolean;
  isKeyPromptOpen: boolean;
};

type ToggleContextType = {
  isOpen: ToggleStateType;
  toggleNewTweet: () => void;
  closeNewTweet: () => void;
  toggleNewComment: () => void;
  toggleSingleTweet: (value: boolean) => void;
  toggleKeyPrompt: (value: boolean) => void;
};

type ToggleComponentPropsType = {
  children: ReactNode;
};

const initialState: ToggleStateType = {
  isNewTweetOpen: false,
  isNewCommentOpen: false,
  isSingleTweetOpen: false,
  isKeyPromptOpen: false,
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
    setIsOpen({
      ...isOpen,
      isNewTweetOpen: false,
      isNewCommentOpen: false,
    });
  }

  function toggleNewComment() {
    setIsOpen({
      ...isOpen,
      isNewTweetOpen: isOpen.isNewTweetOpen ? false : isOpen.isNewTweetOpen,
      isNewCommentOpen: !isOpen.isNewCommentOpen,
    });
  }

  function toggleSingleTweet(value: boolean) {
    setIsOpen({
      ...isOpen,
      isSingleTweetOpen: value ?? !isOpen.isSingleTweetOpen,
    });
  }

  function toggleKeyPrompt(value: boolean) {
    setIsOpen({
      ...isOpen,
      isKeyPromptOpen: value ?? !isOpen.isKeyPromptOpen,
    });
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
      }}
    >
      {children}
    </ToggleContext.Provider>
  );
}

export function useToggleContext() {
  return useContext(ToggleContext);
}
