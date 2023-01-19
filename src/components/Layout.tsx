import React from "react";
import BottomNavBar from "./BottomNavBar";
import useMediaQuery from "../hooks/mediaQuery";

const Layout = ({ children }: { children: ReactElement }) => {
    const isBreakpoint = useMediaQuery(425);
    
    // TODO: only display navbar if user is logged in

    return (
        <div>
            {children}
            {isBreakpoint && <BottomNavBar />}
        </div>
    );
};

export default Layout;
