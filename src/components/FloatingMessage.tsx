import React, { useEffect } from "react";
import { useAppContext } from "../hooks/context/appContext";
import { useToggleContext } from "../hooks/context/toggleContext";

const FloatingMessage = () => {
  const toggleContext = useToggleContext();
  const appContext = useAppContext();

  const closeFloatingMessage = () => {
    toggleContext?.toggleMessage(false);
    appContext?.setMessage("");
  };

  useEffect(() => {
    const messageTimeout = setTimeout(() => {
      closeFloatingMessage();
    }, 2000);

    return () => {
      clearTimeout(messageTimeout);
    };
  });

  return (
    <div
      className={`fixed top-0 flex w-full transform items-center justify-center transition-all duration-200 ${
        toggleContext?.isOpen.isMessageOpen ? "translate-y-20" : ""
      }`}
    >
      <div
        onClick={closeFloatingMessage}
        className="rounded-md border-2 border-black bg-white py-2 px-6"
      >
        <p className="text-lg font-semibold text-black">
          {appContext?.appState.message}
        </p>
      </div>
    </div>
  );
};

export default FloatingMessage;
