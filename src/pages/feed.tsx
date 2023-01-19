import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Tweet from "../components/Tweet";
import useMediaQuery from "../hooks/mediaQuery";
import { trpc } from "../utils/api";
import { generateRandomTweet } from "../utils/generateTweet";
import type { Tweet as TweetModel } from "@prisma/client";
import { TbArrowsShuffle } from "react-icons/tb";
import { GoCheck } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";

const Feed: NextPage = () => {
  const isMobileBreakpoint = useMediaQuery(425);
  const utils = trpc.useContext();
  const tweetsResponse = trpc.mongo.getTweets.useQuery().data;
  const userDetails = trpc.mongo.getUserFromSession.useQuery().data;
  const [tweets, setTweets] = useState<TweetModel[]>([]);
  const [isPostingTweet, setIsPostingTweet] = useState<boolean>(false);
  const [generatedTweet, setGeneratedTweet] = useState("");

  useEffect(() => {
    if (tweetsResponse !== undefined) {
      setTweets(tweetsResponse);
    }
  }, [tweetsResponse]);

  const postTweetMutation = trpc.mongo.postTweet.useMutation({
    onSuccess: async () => {
      await utils.mongo.getTweets.invalidate();
    },
  });

  function postRandomTweet() {
    postTweetMutation.mutate({
      tweet: generatedTweet,
    });
  }

  function fetchTweet() {
    // const random = Math.floor(Math.random() * 100);
    // setGeneratedTweet(
    //   "Just finished up a project using #Typescript - so much fun and powerful! Definitely the way to go for large scale applications. #jsdevs" +
    //     random.toString()
    // );

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

        setGeneratedTweet(newTweet || "");
      })
      .catch((err) => {
        console.log("Error generating tweet", err);
      });
  }

  function generateTweet() {
    setIsPostingTweet((prev) => !prev);
    fetchTweet();
  }

  return (
    <div className="w-full overflow-x-hidden pb-16">
      {isMobileBreakpoint ? (
        <div className="z-0">
          <div className="flex flex-col-reverse space-y-2 pb-4">
            {tweets?.map((tweet, index) => (
              <Tweet key={index} tweet={tweet} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="border-b border-black px-8 py-4">
            <p className="text-2xl font-semibold">Litter</p>
          </div>
        </>
      )}
      {isMobileBreakpoint && (
        <>
          <div
            className={`z-20 fixed overflow-hidden top-0 left-0 flex h-full w-full transform flex-col items-center justify-center bg-black transition-all duration-200 ease-[cubic-bezier(.16,.48,.51,.9)] ${
              isPostingTweet ? "translate-y-0" : "translate-y-full"
            } `}
          >
            <RxCross2
              onClick={() => setIsPostingTweet(false)}
              className="absolute top-8 left-8 text-white"
              size={24}
            />
            <div className="flex flex-col items-center space-y-4  px-6 text-xl text-white">
              <p className="w-full">{generatedTweet}</p>
              <div className="flex items-center justify-center space-x-8">
                <div
                  className="rounded-full bg-white/20 p-2"
                  onClick={fetchTweet}
                >
                  <TbArrowsShuffle />
                </div>
                <p className="text-white/50">&#8226;</p>
                <div
                  className="rounded-full border border-white bg-white/20 p-2"
                  onClick={postRandomTweet}
                >
                  <GoCheck />
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={generateTweet}
            className={`${
              isPostingTweet ? "hidden" : ""
            } fixed right-4 bottom-20 flex h-10 w-20 items-center justify-center rounded-md bg-black px-4 py-2 text-lg font-semibold text-white`}
          >
            <p className={`${isPostingTweet ? "hidden" : "block"}`}>Yeet</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Feed;
