import type { NextPage } from "next";
import Image from "next/image";
import React, { useRef } from "react";
import Tweet from "../components/Tweet";
import { trpc } from "../utils/api";

const Profile: NextPage = () => {
  const userDetails = trpc.mongo.getUserFromSession.useQuery().data;
  const userTweets = trpc.mongo.getTweetsFromUser.useQuery().data;
  const personalityRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="flex w-full flex-col space-y-2 p-2">
      <div className="h-full">
        <div className="flex flex-col items-center border border-black py-4">
          <Image
            className="rounded-full"
            src={userDetails?.image || ""}
            alt="profile picture"
            loading="lazy"
            width={100}
            height={100}
          />
          <p className="py-1 font-semibold">{userDetails?.name}</p>
          <p className="text-xs">{userDetails?.email}</p>
        </div>
      </div>
      {/* Customization */}
      <div className="flex w-full flex-col border border-black py-2 px-4">
        <p className="text-sm font-semibold">Customize the personality of your tweeting AI</p>
        <textarea
          className="min-h-[2rem] border border-gray-50 py-2 outline-none"
          placeholder="Enter keywords here"
          defaultValue={userDetails?.personality ?? ""}
          ref={personalityRef}
        ></textarea>
        <div className="flex justify-end">
          <button
            className="rounded-full w-full bg-black py-1 px-2 text-sm font-bold text-white"
            onClick={updatePesonality}
          >
            Update
          </button>
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

export default Profile;
