import type { ReactElement } from "react";
import React from "react";
import BottomNavBar from "./BottomNavBar";
import useMediaQuery from "../hooks/mediaQuery";
import { ToggleProvider } from "../hooks/context/toggleNewContext";
import { useRouter } from "next/router";
import { RxGear } from "react-icons/rx";
import { LoadingProvider } from "../hooks/context/loadingContext";
import { useModalContext } from "../hooks/context/modalContext";
import UpdateProfileModal from "./UpdateProfileModal";

const Layout = ({ children }: { children: ReactElement }) => {
  const isBreakpoint = useMediaQuery(425);
  const router = useRouter();
  const modalContext = useModalContext();


  function openModal() {
    modalContext?.toggleModal();
  }

  return (
    <div>
      <UpdateProfileModal />
      <div className="fixed z-10 flex w-full items-center justify-between border-b border-black bg-white p-4">
        <p className="text-xl font-semibold">Litter</p>
        {router.pathname === "/profile" && (
          <RxGear size={20} onClick={openModal} />
        )}
      </div>
      <div className="pt-14">
        <LoadingProvider>
          <ToggleProvider>{children}</ToggleProvider>
        </LoadingProvider>
      </div>
      {isBreakpoint && <BottomNavBar />}
    </div>
  );
};

export default Layout;
