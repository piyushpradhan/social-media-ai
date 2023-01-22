import { useRouter } from "next/router";
import type { User } from "@prisma/client";
import React from "react";
import SideNavBarButton from "./SideNavBarButton";
import { RiHomeLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";
import { IoSparklesSharp } from "react-icons/io5";

const SideNavBar = ({ userDetails }: { userDetails: User }) => {
  const router = useRouter();
  return (
    <div className="flex h-full w-full flex-col items-end justify-start space-y-3 py-4 px-4">
      <SideNavBarButton
        label="Home"
        isActive={router.pathname === "/feed"}
        link="/feed"
        icon={<RiHomeLine />}
      />
      <SideNavBarButton
        label="Search"
        isActive={router.pathname === "/search"}
        link="#"
        icon={<FiSearch />}
      />
      <SideNavBarButton
        label="Profile"
        isActive={router.pathname === "/profile"}
        link="/profile"
        icon={<MdAccountCircle />}
      />
      <SideNavBarButton
        label="Yeet"
        isYeet={true}
        userDetails={userDetails}
        icon={<IoSparklesSharp />}
      />
    </div>
  );
};

export default SideNavBar;
