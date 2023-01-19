import React, { useState } from "react";
import { trpc } from "../utils/api";
import Image from "next/image";
import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { AiOutlineRetweet } from "react-icons/ai";
import { BsThreeDots, BsShare } from "react-icons/bs";
import type { Tweet as TweetModel } from "@prisma/client";

type Props = {
  tweet: TweetModel;
};

const Tweet: React.FC<Props> = ({ tweet }: { tweet: TweetModel }) => {
  const utils = trpc.useContext();
  const currentUserDetails = trpc.mongo.getUserFromSession.useQuery().data;
  const userDetails = trpc.mongo.getUser.useQuery({
    userId: tweet.userId,
  }).data;
  const likeTweetMutation = trpc.mongo.likeTweet.useMutation({
    onSuccess: async () => {
      await utils.mongo.getTweets.invalidate();
    },
  });

  const unlikeTweetMutation = trpc.mongo.unlikeTweet.useMutation({
    onSuccess: async () => {
      await utils.mongo.getTweets.invalidate();
    },
  });

  const retweetMutation = trpc.mongo.postRetweet.useMutation({
    onSuccess: async () => {
      await utils.mongo.getTweets.invalidate();
    }
  });

  const undoRetweetMutation = trpc.mongo.undoRetweet.useMutation({
    onSuccess: async () => {
      await utils.mongo.getTweets.invalidate();
    }
  });

  const [isLiked, setIsLiked] = useState(isTweetLikedByCurrentUser());
  const [isRetweeted, setIsRetweeted] = useState(isRetweetedByCurrentUser());

  function isTweetLikedByCurrentUser() {
    return tweet.likedUserIDs.includes(currentUserDetails?.id ?? "");
  }

  function isRetweetedByCurrentUser() {
    if (tweet.retweetedUserIDs.length === 0) {
      return false;
    }

    return tweet.retweetedUserIDs.includes(currentUserDetails?.id ?? "")
  }

  function retweet() {
    if (!isRetweeted) {
      retweetMutation.mutate({
        tweet: tweet.tweet,
        tweetId: tweet.id,
      });
      setIsRetweeted(true);
    }
  }

  // TODO: Implement undo retweet logic
  // function undoRetweet() {
  // }

  function likeTweet() {
    likeTweetMutation.mutate({
      tweetId: tweet.id,
    });
    setIsLiked(true);
  }

  function unlikeTweet() {
    unlikeTweetMutation.mutate({
      tweetId: tweet.id,
    });
    setIsLiked(false);
  }

  return (
    <div className="flex h-full w-full space-x-2 rounded-sm border-b border-black py-2 px-4">
      <div className="flex h-full items-start">
        <div className="relative h-12 w-12">
          <Image
            className="rounded-full"
            src={userDetails?.image || ""}
            loading="lazy"
            fill={true}
            alt="user profile"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-md font-semibold">{userDetails?.name}</p>
        <div className="text-sm">{tweet.tweet}</div>
        <div className="flex justify-between pt-2">
          <div className="flex items-center justify-center space-x-1">
            <FaRegComment size={14} />
            <p className="text-xs text-gray-800">{}</p>
          </div>
          <div className="flex items-center justify-center space-x-1">
            {isLiked ? <FaHeart size={14} onClick={unlikeTweet} className="text-red-600" /> : <FaRegHeart size={14} onClick={likeTweet} />}
            <p className="text-xs text-gray-800">{tweet.likes}</p>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <AiOutlineRetweet size={14} onClick={retweet} className={`text-xs ${isRetweeted ? "text-green-500 disable" : "text-gray-800"}`} />
            <p className="text-xs text-gray-800">{tweet.retweetedUserIDs.length}</p>
          </div>
          <BsShare size={14} />
        </div>
      </div>
      <div className="flex h-full items-start pr-1">
        <BsThreeDots size={12} />
      </div>
    </div>
  );
};

export default Tweet;
