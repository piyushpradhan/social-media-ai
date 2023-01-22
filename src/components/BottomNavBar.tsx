import React from "react";
import Link from "next/link";
import { GrHomeRounded } from "react-icons/gr";
import { FiSearch } from "react-icons/fi";
import { BsPerson } from "react-icons/bs";

const BottomNavBar = () => {
  return (
    <div className="text-gray-font border-gray-99 fixed bottom-0 z-10 flex h-16 w-full justify-between border-t bg-white px-6 py-2 shadow-lg">
      <Link href="/">
        <div className="text-primary flex cursor-pointer flex-col items-center rounded-full p-3 text-center text-sm hover:bg-gray-200 hover:text-gray-700">
          <GrHomeRounded />
        </div>
      </Link>
      <Link href="/">
        <div className="text-primary flex cursor-pointer flex-col items-center rounded-full p-3 text-center text-sm hover:bg-gray-200 hover:text-gray-700">
          <FiSearch />
        </div>
      </Link>
      <Link href="/profile">
        <div className="text-primary flex cursor-pointer flex-col items-center rounded-full p-3 text-center text-sm hover:bg-gray-200 hover:text-gray-700">
          <BsPerson />
        </div>
      </Link>
    </div>
  );
};

export default BottomNavBar;
