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
import SideNavBar from "./SideNavBar";

const Layout = ({ children }: { children: ReactElement }) => {
  const isMobileBreakpoint = useMediaQuery(500);
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
      {userDetails && <NewTweet userDetails={userDetails} />}
      <UpdateProfileModal />
      {/* Top nav bar */}
      <div className="fixed z-10 flex w-full items-center justify-between border-b border-black bg-white p-4">
        <p className="text-xl font-semibold">Litter</p>
        {router.pathname === "/profile" && (
          <RxGear size={20} onClick={openModal} />
        )}
      </div>
      {isMobileBreakpoint ? (
        <div className="pt-14">{children}</div>
      ) : (
        <div className="px-8 pt-14">
          <div className="grid h-full w-full grid-cols-5 gap-4 lg:grid-cols-7">
            <div className="col-span-1 h-full lg:col-span-2">
              {userDetails && <SideNavBar userDetails={userDetails} />}
            </div>
            <div className="col-span-3">{children}</div>
            <div className="col-span-1 lg:col-span-2"></div>
          </div>
        </div>
      )}
      {isMobileBreakpoint && <BottomNavBar />}
    </div>
  );
};

export default Layout;
