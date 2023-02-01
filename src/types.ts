import type { ReactNode } from "react";

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
