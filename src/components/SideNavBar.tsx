import { useRouter } from "next/router";
import type { User } from "@prisma/client";
import React from "react";
import SideNavBarButton from "./SideNavBarButton";

const SideNavBar = ({ userDetails }: { userDetails: User}) => {
  const router = useRouter();
  return (
    <div className="flex h-full w-full flex-col items-end justify-start space-y-3 py-4 px-4">
      <SideNavBarButton label="Home" isActive={router.pathname === "/feed"} link="/feed" />
      <SideNavBarButton
        label="Search"
        isActive={router.pathname === "/search"}
        link="/search"
      />
      <SideNavBarButton
        label="Profile"
        isActive={router.pathname === "/profile"}
        link="/profile"
      />
      <SideNavBarButton label="Yeet" isYeet={true} userDetails={userDetails}/>
    </div>
  );
};

export default SideNavBar;
