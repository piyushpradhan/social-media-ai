import React from "react";
import BottomNavBar from "./BottomNavBar";
import useMediaQuery from "../hooks/mediaQuery";
import { ToggleProvider } from "../hooks/context/toggleNewContext";
import { LoadingProvider } from "../hooks/context/loadingContext";

const Layout = ({ children }: { children: ReactElement }) => {
  const isBreakpoint = useMediaQuery(425);

  return (
    <div>
      <div className="fixed z-10 w-full border-b border-black bg-white p-4">
        <p className="text-xl font-semibold">Litter</p>
      </div>
      <div className="pt-14">
        <LoadingProvider>
          <ToggleProvider>
          {children}
          </ToggleProvider>
        </LoadingProvider>
      </div>
      {isBreakpoint && <BottomNavBar />}
    </div>
  );
};

export default Layout;
