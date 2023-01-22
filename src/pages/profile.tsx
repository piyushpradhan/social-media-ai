import type { NextPage } from "next";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { MdAccountCircle } from "react-icons/md";
import Tweet from "../components/Tweet";
import { trpc } from "../utils/api";
import { useModalContext } from "../hooks/context/modalContext";

const Profile: NextPage = () => {
  const userDetails = trpc.mongo.getUserFromSession.useQuery().data;
  const userTweets = trpc.mongo.getTweetsFromCurrentUser.useQuery().data;
  const personalityRef = useRef<HTMLTextAreaElement>(null);
  const modalContext = useModalContext();

  useEffect(() => {
    modalContext?.toggleKeyPromptModal(false);
  }, []);

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
          <p className="py-1 text-xl font-semibold">{userDetails?.name}</p>
          <p className="text-sm">{userDetails?.email}</p>
        </div>
      </div>
      {/* Customization */}
      <div className="flex w-full flex-col border border-black py-4 px-4">
        <p className="text-md font-semibold">
          Customize the personality of your tweeting AI
        </p>
        <textarea
          className="min-h-[2rem] border border-gray-50 py-2 outline-none"
          placeholder="Enter keywords here"
          defaultValue={userDetails?.personality ?? ""}
          ref={personalityRef}
        ></textarea>
        <div className="flex justify-end">
          <button
            className="w-full rounded-full bg-black py-1 px-2 text-sm font-bold text-white"
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
