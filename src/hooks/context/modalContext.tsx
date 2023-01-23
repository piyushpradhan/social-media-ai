import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type ModalStateType = {
  isProfileModalOpen: boolean;
  isKeyPromptModalOpen: boolean;
  key: string;
};

type ModalContextType = {
  modalState: ModalStateType;
  toggleModal: (value?: boolean) => void;
  toggleKeyPromptModal: (value?: boolean) => void;
  setKey: (key: string) => void;
};

type ModalPropsType = {
  children: ReactNode;
};

const initialState: ModalStateType = {
  isProfileModalOpen: false,
  isKeyPromptModalOpen: true,
  key: "",
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalStateType>(initialState);

  function toggleModal(value?: boolean) {
    setModalState((prev) => ({
      ...prev,
      isProfileModalOpen: value ?? !prev.isProfileModalOpen,
    }));
  }

  function toggleKeyPromptModal(vaule?: boolean) {
    setModalState((prev) => ({
      ...prev,
      isKeyPromptModalOpen: vaule ?? !prev.isKeyPromptModalOpen,
    }));
  }

  function setKey(key: string) {
    setModalState((prev) => ({
      ...prev,
      key: key,
    }));
  }

  return (
    <ModalContext.Provider
      value={{
        modalState,
        toggleModal,
        toggleKeyPromptModal,
        setKey,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  return useContext(ModalContext);
}
