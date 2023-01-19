import React from "react";
import BottomNavBar from "./BottomNavBar";
import useMediaQuery from "../hooks/mediaQuery";

const Layout = ({ children }: { children: ReactElement }) => {
  const isBreakpoint = useMediaQuery(425);

  // TODO: only display navbar if user is logged in

  return (
    <div>
      <div className="p-4 fixed bg-white z-10 w-full border-b border-black">
        <p className="text-xl font-semibold">Litter</p>
      </div>
      <div className="pt-14">
        {children}
      </div>
      {isBreakpoint && <BottomNavBar />}
    </div>
  );
};

export default Layout;
