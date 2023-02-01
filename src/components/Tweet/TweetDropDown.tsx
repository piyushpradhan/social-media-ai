import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { trpc } from "../../utils/api";
import type { Tweet, User } from "@prisma/client";
import { useAppContext } from "../../hooks/context/appContext";
import { useToggleContext } from "../../hooks/context/toggleContext";

const TweetDropDown = ({
  tweet,
  currentUser,
}: {
  tweet: Tweet;
  currentUser: User;
}) => {
  const utils = trpc.useContext();
  const appContext = useAppContext();
  const toggleContext = useToggleContext();

  const deleteTweetMutation = trpc.mongo.deleteTweet.useMutation({
    onSuccess: async () => {
      await utils.mongo.getTweets.invalidate();
      if (appContext?.appState.selectedTweet) {
        await utils.mongo.getComments.invalidate();
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

  function deleteTweet() {
    if (currentUser.id === tweet.userId) {
      deleteTweetMutation.mutate({
        tweetId: tweet.id,
        tweetUserId: tweet.userId,
      });
    }
  }

  function deleteComment() {
    if (currentUser.id === tweet.userId && tweet.commentId != null) {
      deleteCommentMutation.mutate({
        tweetId: tweet.commentId,
        commentId: tweet.id,
      });
    }
  }

  function handleDelete() {
    if (currentUser.id === tweet.userId) {
      if (tweet.commentId != null) {
        deleteComment();
      } else {
        deleteTweet();
      }
    }
  }

  return (
    <Menu as="div" className="relative flex h-full items-start pr-2">
      <Menu.Button className="">
        <BsThreeDots size={12} />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-4 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          {currentUser.id === tweet.userId && (
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleDelete}
                  className={`${
                    active ? "bg-black text-white" : "bg-white"
                  } group flex w-full items-center rounded-md border-2 border-black px-2 py-2 text-sm`}
                >
                  <RiDeleteBinLine
                    className={`mr-2 h-5 w-5 ${
                      active ? "text-white" : "text-black"
                    }`}
                    aria-hidden="true"
                  />
                  Delete
                </button>
              )}
            </Menu.Item>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default TweetDropDown;
