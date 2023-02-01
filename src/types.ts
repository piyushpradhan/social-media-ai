import type { Tweet } from "@prisma/client";
import type { ReactNode } from "react";

export type AppStateType = {
  generatedTweet: string;
  generatedComment: string;
  selectedTweet: Tweet | null;
};

export type AppContextType = {
  appState: AppStateType;
  setGeneratedTweet: (tweet: string) => void;
  setGeneratedComment: (comment: string) => void;
  setSelectedTweet: (tweet: Tweet) => void;
};

export type AppComponentProps = {
  children: ReactNode;
};

export type InitialLoadingState = {
  loading: boolean;
  tweetLoading: boolean;
};

export type LoadingContextType = {
  loading: InitialLoadingState;
  toggleLoading: (value: boolean) => void;
  toggleTweetLoading: (value: boolean) => void;
};

export type ModalStateType = {
  isProfileModalOpen: boolean;
  isKeyPromptModalOpen: boolean;
  key: string;
};

export type ModalContextType = {
  modalState: ModalStateType;
  toggleModal: (value?: boolean) => void;
  toggleKeyPromptModal: (value?: boolean) => void;
  setKey: (key: string) => void;
};

export type ModalPropsType = {
  children: ReactNode;
};
