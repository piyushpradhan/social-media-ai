import { createContext, ReactNode, useContext, useState } from "react";

type ToggleStateType = {
  isNewTweetOpen: boolean;
  isNewCommentOpen: boolean;
};

type ToggleContextType = {
  isOpen: ToggleStateType;
  toggleNewTweet: () => void;
  closeNewTweet: () => void;
  toggleNewComment: () => void;
};

type ToggleComponentPropsType = {
  children: ReactNode;
};

const initialState: ToggleStateType = {
  isNewTweetOpen: false,
  isNewCommentOpen: false,
};

const ToggleContext = createContext<ToggleContextType | null>(null);

export function ToggleProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<ToggleStateType>(initialState);

  function toggleNewTweet() {
    setIsOpen({
      isNewTweetOpen: !isOpen.isNewTweetOpen,
      isNewCommentOpen: isOpen.isNewCommentOpen
        ? false
        : isOpen.isNewCommentOpen,
    });
  }

  function closeNewTweet() {
    setIsOpen({
      isNewTweetOpen: false,
      isNewCommentOpen: false,
    });
  }

  function toggleNewComment() {
    setIsOpen({
      isNewTweetOpen: isOpen.isNewTweetOpen ? false : isOpen.isNewTweetOpen,
      isNewCommentOpen: !isOpen.isNewCommentOpen,
    });
  }

  return (
    <ToggleContext.Provider
      value={{
        isOpen,
        toggleNewTweet,
        closeNewTweet,
        toggleNewComment,
      }}
    >
      {children}
    </ToggleContext.Provider>
  );
}

export function useToggleContext() {
  return useContext(ToggleContext);
}
