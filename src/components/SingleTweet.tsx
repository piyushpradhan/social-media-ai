import React from "react";
import type { Tweet as TweetModal, User } from "@prisma/client";
import { useToggleContext } from "../hooks/context/toggleContext";
import { FiArrowLeft } from "react-icons/fi";
import Image from "next/image";
import { MdAccountCircle } from "react-icons/md";
import ScaledTweet from "../components/ScaledTweet";
import { trpc } from "../utils/api";
import Tweet from "./Tweet";
import useMediaQuery from "../hooks/mediaQuery";

type Props = {
  tweet: TweetModal;
  userDetails: User;
};

const SingleTweet: React.FC<Props> = ({ tweet, userDetails }: Props) => {
  const toggleContext = useToggleContext();
  const getComments = trpc.mongo.getComments.useQuery({
    tweetId: tweet.id,
  }).data;
  const isMobileBreakpoint = useMediaQuery(500);

  function closeSingleTweet() {
    toggleContext?.toggleSingleTweet(false);
  }

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div
        className={`fixed top-0 left-0 z-20 flex items-center h-full w-full transform flex-col overflow-hidden bg-white transition-all duration-200 ease-[cubic-bezier(.16,.48,.51,.9)] ${
          toggleContext?.isOpen?.isSingleTweetOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex max-w-3xl w-full justify-start space-x-4 border-b border-gray-500 px-3 py-4">
          <button className="text-xl" onClick={closeSingleTweet}>
            <FiArrowLeft />
          </button>
          <p className="text-xl font-bold">Comments</p>
        </div>
        <div className="flex h-full w-full flex-col max-w-3xl">
          <div className="w-full px-2 pt-2">
            <ScaledTweet tweet={tweet} />
          </div>
          {tweet.commentCount > 0 &&
            getComments?.map((comment) => (
              <Tweet key={comment.id} tweet={comment} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SingleTweet;
