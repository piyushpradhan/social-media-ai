import { ReactNode, createContext, useContext, useState } from "react";

type ModalStateType = {
  isOpen: boolean;
  key: string;
};

type ModalContextType = {
  modalState: ModalStateType;
  toggleModal: (value?: boolean) => void;
  setKey: (key: string) => void;
};

type ModalPropsType = {
  children: ReactNode;
};

const initialState: ModalStateType = {
  isOpen: false,
  key: "",
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalStateType>(initialState);

  function toggleModal(value?: boolean) {
    setModalState({
      ...modalState,
      isOpen: value ?? !modalState.isOpen,
    });
  }

  function setKey(key: string) {
    setModalState({
      ...modalState,
      key: key,
    });
  }

  return (
    <ModalContext.Provider value={{ 
        modalState, 
        toggleModal,
        setKey
      }}>
      {children}
      </ModalContext.Provider>
  )
}

export function useModalContext() {
  return useContext(ModalContext);
}
