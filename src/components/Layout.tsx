import type { ReactElement } from "react";
import React from "react";
import BottomNavBar from "./BottomNavBar";
import useMediaQuery from "../hooks/mediaQuery";
import { useRouter } from "next/router";
import { RxGear } from "react-icons/rx";
import { useModalContext } from "../hooks/context/modalContext";
import UpdateProfileModal from "./UpdateProfileModal";
import SingleTweet from "./SingleTweet";
import { trpc } from "../utils/api";
import NewTweet from "./NewTweet";
import { useAppContext } from "../hooks/context/appContext";
import { useToggleContext } from "../hooks/context/toggleContext";

const Layout = ({ children }: { children: ReactElement }) => {
  const isMobileBreakpoint = useMediaQuery(768);
  const router = useRouter();
  const modalContext = useModalContext();
  const appContext = useAppContext();
  const toggleContext = useToggleContext();

  const userDetails = trpc.mongo.getUserFromSession.useQuery().data;

  function openModal() {
    modalContext?.toggleModal();
  }

  return (
    <div>
      {appContext?.appState?.selectedTweet &&
        toggleContext?.isOpen?.isSingleTweetOpen &&
        userDetails && (
          <SingleTweet
            tweet={appContext?.appState?.selectedTweet}
            userDetails={userDetails}
          />
        )}
      {isMobileBreakpoint && userDetails && (
        <NewTweet userDetails={userDetails} />
      )}
      <UpdateProfileModal />
      <div className="fixed z-10 flex w-full items-center justify-between border-b border-black bg-white p-4">
        <p className="text-xl font-semibold">Litter</p>
        {router.pathname === "/profile" && (
          <RxGear size={20} onClick={openModal} />
        )}
      </div>
      <div className="pt-14">{children}</div>
      {isMobileBreakpoint && <BottomNavBar />}
    </div>
  );
};

export default Layout;
