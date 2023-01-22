import React from "react";
import { useToggleContext } from "../hooks/context/toggleContext";
import { useLoadingContext } from "../hooks/context/loadingContext";
import { RxCross2 } from "react-icons/rx";
import { generateRandomTweet } from "../utils/generateTweet";
import type { User } from "@prisma/client";
import { useAppContext } from "../hooks/context/appContext";
import { GoCheck } from "react-icons/go";
import { TbArrowsShuffle } from "react-icons/tb";
import Shimmer from "./loaders/Shimmer";
import { trpc } from "../utils/api";
import useMediaQuery from "../hooks/mediaQuery";

const NewTweet = ({ userDetails }: { userDetails: User }) => {
  const utils = trpc.useContext();
  const isMobileBreakpoint = useMediaQuery(500);

  const toggleContext = useToggleContext();
  const loadingContext = useLoadingContext();
  const appContext = useAppContext();

  const { isOpen, toggleNewComment, toggleNewTweet, closeNewTweet } =
    toggleContext || {};
  const { appState, setGeneratedTweet } = appContext || {};
  const { toggleTweetLoading, loading } = loadingContext || {};
  const { generatedTweet, generatedComment, selectedTweet } = appState || {};

  const postTweetMutation = trpc.mongo.postTweet.useMutation({
    onSuccess: async () => {
      await utils.mongo.getTweets.invalidate();
      toggleTweetLoading?.(false);
    },
  });

  const postCommentMutation = trpc.mongo.postComment.useMutation({
    onSuccess: async () => {
      await utils.mongo.getTweets.invalidate();
      toggleTweetLoading?.(false);
    },
  });

  function postRandom() {
    if (isOpen?.isNewTweetOpen) {
      toggleNewTweet?.();
      if (generatedTweet !== undefined) {
        postTweetMutation.mutate({
          tweet: generatedTweet,
        });
      }
    } else if (isOpen?.isNewCommentOpen) {
      toggleNewComment?.();
      if (selectedTweet?.id !== undefined && generatedComment !== undefined) {
        postCommentMutation.mutate({
          tweetId: selectedTweet?.id,
          comment: generatedComment,
        });
      }
    }
  }

  function fetchTweet() {
    toggleTweetLoading?.(true);
    //
    // const random = Math.floor(Math.random() * 100);
    // setTimeout(() => {
    //   setGeneratedTweet?.(
    //     "Just finished up a project using #Type script - so much fi andDefinitely the way to go for large scale applications. #jsdevs" +
    //       random.toString()
    //   );
    //   toggleTweetLoading?.(false);
    // }, 600);
    //
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

        setGeneratedTweet?.(newTweet ?? "");
        toggleTweetLoading?.(false);
      })
      .catch((err) => {
        console.error("Error generating tweet", err);
      });
  }

  function generateTweet() {
    toggleNewTweet?.();
    fetchTweet();
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 z-20 flex h-full w-full transform flex-col items-center justify-center overflow-hidden bg-black transition-all duration-200 ease-[cubic-bezier(.16,.48,.51,.9)] ${
          isOpen?.isNewTweetOpen || isOpen?.isNewCommentOpen
            ? "translate-y-0"
            : "translate-y-full"
        } `}
      >
        <RxCross2
          onClick={closeNewTweet}
          className="absolute top-8 left-8 cursor-pointer text-white"
          size={24}
        />
        <div className="flex h-64 w-full flex-col items-center px-12 text-white md:w-1/2">
          <div className="flex w-full flex-1 items-center justify-center">
            {loading?.tweetLoading ? (
              <Shimmer />
            ) : (
              <p
                className={`h-full w-full text-center ${
                  isMobileBreakpoint ? "" : "text-lg"
                }`}
              >
                {isOpen?.isNewTweetOpen ? generatedTweet : generatedComment}
              </p>
            )}
          </div>
          <div className="flex flex-1 items-center justify-center space-x-8">
            <div
              className="cursor-pointer rounded-full bg-white/20 p-2"
              onClick={fetchTweet}
            >
              <TbArrowsShuffle size={!isMobileBreakpoint ? 24 : 16} />
            </div>
            <p className="text-white/50">&#8226;</p>
            <div
              className="cursor-pointer rounded-full border border-white bg-white/20 p-2"
              onClick={postRandom}
            >
              <GoCheck size={!isMobileBreakpoint ? 24 : 16} />
            </div>
          </div>
        </div>
      </div>
      {isMobileBreakpoint && (
        <div
          onClick={generateTweet}
          className={`${
            isOpen?.isNewTweetOpen ? "hidden" : ""
          } fixed right-4 bottom-20 flex h-10 w-20 items-center justify-center rounded-md bg-black px-4 py-2 text-lg font-semibold text-white`}
        >
          <p className={`${isOpen?.isNewTweetOpen ? "hidden" : "block"}`}>
            Yeet
          </p>
        </div>
      )}
    </>
  );
};

export default NewTweet;
