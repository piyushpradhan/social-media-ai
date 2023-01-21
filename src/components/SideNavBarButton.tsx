import type { User } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { useAppContext } from "../hooks/context/appContext";
import {
  useLoadingContext,
} from "../hooks/context/loadingContext";
import { useToggleContext } from "../hooks/context/toggleContext";
import { generateRandomTweet } from "../utils/generateTweet";

type Props = {
  label: string;
  isYeet?: boolean;
  isActive?: boolean;
  link?: string;
  userDetails?: User;
};

const SideNavBarButton: React.FC<Props> = ({
  label,
  isActive,
  isYeet = false,
  link = "",
  userDetails,
}: Props) => {
  const router = useRouter();
  const toggleContext = useToggleContext();
  const loadingContext = useLoadingContext();
  const appContext = useAppContext();

  function fetchTweet() {
    loadingContext?.toggleTweetLoading(true);

    // const random = Math.floor(Math.random() * 100);
    // setTimeout(() => {
    //   appContext?.setGeneratedTweet(
    //     "Just finished up a project using #Type script - so much fi andDefinitely the way to go for large scale applications. #jsdevs" +
    //       random.toString()
    //   );
    //   loadingContext?.toggleTweetLoading(false);
    // }, 600);

    generateRandomTweet(userDetails?.personality || "")
      .then((generated) => {
        if (generated?.data?.choices[0]?.text === undefined) {
          throw new Error("Could not generate tweet");
        }
        let newTweet: string | undefined =
          generated?.data?.choices?.at(0)?.text;
        if (newTweet?.includes("\n")) {
          const lastNewLine = newTweet?.lastIndexOf("\n");
          newTweet = newTweet?.substring(lastNewLine + 1);
        }

        appContext?.setGeneratedTweet(newTweet ?? "");
        loadingContext?.toggleTweetLoading(false);
      })
      .catch((err) => {
        console.log("Error generating tweet", err);
      });
  }

  const handleClick = () => {
    if (!isYeet) {
      router
        .push(link)
        .then(() => {
          console.log(`navigated to ${link}`);
        })
        .catch((err: any) => {
          console.error(err);
        });
      return;
    }
    toggleContext?.toggleNewTweet();
    fetchTweet();
  };

  return (
    <button
      onClick={handleClick}
      className={`w-64 py-2 px-4 text-xl transition-all duration-200 ${
        isActive ? "font-bold" : ""
      } ${
        isYeet
          ? "rounded-md border-2 border-black bg-black font-bold text-white hover:bg-white hover:text-black"
          : "rounded-full bg-white text-black hover:bg-gray-200/50 hover:text-black"
      }`}
    >
      {label}
    </button>
  );
};

export default SideNavBarButton;