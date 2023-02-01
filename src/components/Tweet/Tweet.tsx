import React, { useState } from "react";
import { trpc } from "../../utils/api";
import Image from "next/image";
import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { AiOutlineRetweet } from "react-icons/ai";
import { BsThreeDots, BsShare } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import type { Tweet as TweetModel } from "@prisma/client";
import { BiSubdirectoryRight } from "react-icons/bi";

import { useToggleContext } from "../../hooks/context/toggleContext";
import { useLoadingContext } from "../../hooks/context/loadingContext";
import { useAppContext } from "../../hooks/context/appContext";
import { generateRandomComment } from "../../utils/generateTweet";
import { useRouter } from "next/router";
import TweetDropDown from "./TweetDropDown";
import { isValidKey } from "../../utils/validate";

type Props = {
  tweet: TweetModel;
  scaled?: boolean;
};

const Tweet: React.FC<Props> = ({
  tweet,
  scaled = false,
}: {
  tweet: TweetModel;
  scaled?: boolean;
}) => {
  const utils = trpc.useContext();
  const router = useRouter();

  const toggleContext = useToggleContext();
  const loadingContext = useLoadingContext();
  const appContext = useAppContext();

  const currentUserDetails = trpc.mongo.getUserFromSession.useQuery().data;
  const userDetails = trpc.mongo.getUser.useQuery({
    userId: tweet.userId,
  }).data;

  let commentDetails;
  let commentUserDetails;
  if (tweet.commentId && scaled) {
    commentDetails = trpc.mongo.getSingleTweet.useQuery({
      tweetId: tweet.commentId ?? "",
    }).data;

    commentUserDetails = trpc.mongo.getUser.useQuery({
      userId: commentDetails?.userId ?? "",
    }).data;
  }

  const likeTweetMutation = trpc.mongo.likeTweet.useMutation({
    onSuccess: async () => {
      if (toggleContext?.isOpen.isSingleTweetOpen) {
        await utils.mongo.getSingleTweet.refetch({
          tweetId: tweet.id,
        });
        await utils.mongo.getComments.invalidate();
      } else {
        await utils.mongo.getTweets.invalidate();
      }
    },
  });
  const unlikeTweetMutation = trpc.mongo.unlikeTweet.useMutation({
    onSuccess: async () => {
      if (toggleContext?.isOpen.isSingleTweetOpen) {
        await utils.mongo.getSingleTweet.refetch({
          tweetId: tweet.id,
        });
        await utils.mongo.getComments.invalidate();
      } else {
        await utils.mongo.getTweets.invalidate();
      }
    },
  });

  const retweetMutation = trpc.mongo.postRetweet.useMutation({
    onSuccess: async () => {
      if (toggleContext?.isOpen.isSingleTweetOpen) {
        await utils.mongo.getSingleTweet.refetch({
          tweetId: tweet.id,
        });
        await utils.mongo.getComments.invalidate();
      } else {
        await utils.mongo.getTweets.invalidate();
      }
      appContext?.setMessage("Retweeted!");
      toggleContext?.toggleMessage(true);
    },
  });
  const undoRetweetMutation = trpc.mongo.undoRetweet.useMutation({
    onSuccess: async () => {
      if (toggleContext?.isOpen.isSingleTweetOpen) {
        await utils.mongo.getSingleTweet.refetch({
          tweetId: tweet.id,
        });
        await utils.mongo.getComments.invalidate();
      } else {
        await utils.mongo.getTweets.invalidate();
      }
    },
  });

  const deleteCommentMutation = trpc.mongo.deleteComment.useMutation({
    onSuccess: async () => {
      if (toggleContext?.isOpen.isSingleTweetOpen) {
        await utils.mongo.getSingleTweet.refetch({
          tweetId: tweet.id,
        });
        await utils.mongo.getComments.invalidate();
      } else {
        await utils.mongo.getTweets.invalidate();
      }
    },
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

    return tweet.retweetedUserIDs.includes(currentUserDetails?.id ?? "");
  }

  function retweet() {
    if (!isRetweeted) {
      retweetMutation.mutate({
        tweet: tweet.tweet,
        tweetId: tweet.id,
        commentId: tweet.commentId,
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

  function fetchComment() {
    loadingContext?.toggleTweetLoading(true);
    // const random = Math.floor(Math.random() * 100);
    // setTimeout(() => {
    //   appContext?.setGeneratedComment(
    //     "Just COMMENT finished up a project using #Type script - so much fi andDefinitely the way to go for large scale applications. #jsdevs" +
    //       random.toString()
    //   );
    //   loadingContext?.toggleTweetLoading?.(false);
    // }, 600);

    if (userDetails?.key && !isValidKey(userDetails?.key)) {
      appContext?.setMessage("API key is invalid");
      toggleContext?.toggleMessage(true);
    }

    userDetails?.key &&
      generateRandomComment(tweet.tweet, userDetails?.key)
        .then((generated) => {
          if (generated?.data?.choices[0]?.text === undefined) {
            throw new Error("Could not generate tweet");
          }
          let newComment: string | undefined =
            generated?.data?.choices?.at(0)?.text;
          if (newComment?.includes("\n")) {
            const lastNewLine = newComment?.lastIndexOf("\n");
            newComment = newComment?.substring(lastNewLine + 1);
          }

          appContext?.setGeneratedComment(newComment ?? "");
          loadingContext?.toggleTweetLoading(false);
        })
        .catch((err) => {
          console.log("Error generating tweet", err);
        });
  }

  function generateComment() {
    appContext?.setSelectedTweet(tweet);
    toggleContext?.toggleNewComment();
    fetchComment();
  }

  function openSingleTweet() {
    if (scaled) {
      return;
    }
    appContext?.setSelectedTweet(tweet);
    toggleContext?.toggleSingleTweet(true);
  }

  function navigateToProfile() {
    router
      .push(`/profile/${userDetails?.id ?? ""}`)
      .then(() => {
        // close the single tweet
        // toggleContext?.toggleSingleTweet(false);
      })
      .catch((err: any) => console.error(err));
  }

  return (
    <div
      className={`flex w-full flex-col items-center space-x-2 border-b border-black ${
        scaled ? "py-2" : "px-4 pt-4 pb-2"
      }`}
    >
      <div className="flex w-full ">
        {tweet.commentId && (
          <p
            className={`flex text-xs text-gray-500 ${
              scaled ? "pl-16" : "ml-3 pl-12"
            }`}
          >
            <BiSubdirectoryRight className="text-sm" /> Replying to{" "}
            <span className="font-medium">{commentUserDetails?.name}</span>
          </p>
        )}
      </div>
      <div className="flex h-full w-full space-x-2">
        <div className="flex h-full items-start">
          <div className={`relative ${scaled ? "h-16 w-16" : "h-12 w-12"}`}>
            {userDetails?.image ? (
              <Image
                className="rounded-full"
                src={userDetails?.image}
                loading="lazy"
                fill={true}
                alt="UserProfile"
                sizes="100%"
              />
            ) : (
              <MdAccountCircle className="h-full w-full text-black" />
            )}
          </div>
        </div>
        <div className="flex w-full flex-col">
          <p
            className={`${
              scaled ? "text-xl" : "text-md"
            } cursor-pointer font-semibold`}
            onClick={navigateToProfile}
          >
            {userDetails?.name}
          </p>
          <div className="cursor-pointer text-sm" onClick={openSingleTweet}>
            {tweet.tweet}
          </div>
          <div className="flex justify-between pt-2">
            <div className="flex items-center justify-center space-x-1">
              <FaRegComment
                className="cursor-pointer"
                size={14}
                onClick={generateComment}
              />
              <p className="text-xs text-gray-800">{tweet.commentCount}</p>
            </div>
            <div className="flex items-center justify-center space-x-1">
              {isLiked ? (
                <FaHeart
                  size={14}
                  onClick={unlikeTweet}
                  className="cursor-pointer text-red-600"
                />
              ) : (
                <FaRegHeart
                  size={14}
                  onClick={likeTweet}
                  className="cursor-pointer"
                />
              )}
              <p className="text-xs text-gray-800">{tweet.likes}</p>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <AiOutlineRetweet
                size={14}
                onClick={retweet}
                className={`cursor-pointer text-xs ${
                  isRetweeted ? "disable text-green-500" : "text-gray-800"
                }`}
              />
              <p className="text-xs text-gray-800">
                {tweet.retweetedUserIDs.length}
              </p>
            </div>
            <BsShare size={14} />
          </div>
        </div>
        {currentUserDetails && (
          <TweetDropDown tweet={tweet} currentUser={currentUserDetails} />
        )}
      </div>
    </div>
  );
};

export default Tweet;
