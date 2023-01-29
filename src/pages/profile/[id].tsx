import type { Tweet as TweetModel } from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useRef, useState, useEffect } from "react";
import { MdAccountCircle } from "react-icons/md";
import Tweet from "../../components/Tweet/Tweet";
import { useLoadingContext } from "../../hooks/context/loadingContext";
import { trpc } from "../../utils/api";

const UserProfile: NextPage = () => {
  const utils = trpc.useContext();
  const router = useRouter();
  const { id } = router.query;
  const userDetails = trpc.mongo.getUser.useQuery({
    userId: id?.toString() ?? "",
  }).data;
  const userTweets = trpc.mongo.getTweetsFromUser.useQuery({
    id: id?.toString() ?? "",
  }).data;
  const personalityRef = useRef<HTMLTextAreaElement>(null);
  const [tweets, setTweets] = useState<TweetModel[]>([]);

  const loadingContext = useLoadingContext();

  useEffect(() => {
    if (userTweets !== undefined) {
      setTweets(userTweets);
      loadingContext?.toggleLoading(false);
    }
  }, [userTweets]);

  const updatePersonalityMutation =
    trpc.mongo.updateUserPersonality.useMutation({
      onSuccess: () => {
        console.log("Updated personality");
      },
    });

  function updatePesonality() {
    updatePersonalityMutation.mutate({
      personality: personalityRef.current?.value || "",
    });
  }

  return (
    <div className="flex h-screen w-full flex-col space-y-2 overflow-y-auto p-2">
      <div className="">
        <div className="flex flex-col items-center border border-black py-4">
          {userDetails?.image ? (
            <Image
              className="rounded-full"
              src={userDetails?.image ?? ""}
              alt="profile picture"
              loading="lazy"
              width={100}
              height={100}
            />
          ) : (
            <MdAccountCircle size={100} className="text-black" />
          )}
          <p className="py-1 text-xl font-semibold">
            {userDetails?.name?.length === 0
              ? "User doesn't exist"
              : userDetails?.name}
          </p>
          <p className="text-sm">{userDetails?.email}</p>
          {/*
          <div className="mt-4 flex w-full justify-center space-x-8">
            <div className="flex flex-col items-center justify-center">
              <p className="text-md font-bold">Followers</p>
              <p className="text-sm">{userDetails?.followerIDs.length}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-md font-bold">Following</p>
              <p className="text-sm">{userDetails?.followingIDs.length}</p>
            </div>
          </div>
        */}
        </div>
      </div>
      <div className="flex w-full flex-col-reverse space-y-1 pb-16">
        {userTweets?.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
