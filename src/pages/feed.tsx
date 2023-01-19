import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Tweet from "../components/Tweet";
import useMediaQuery from "../hooks/mediaQuery";
import { trpc } from "../utils/api";
import { generateRandomTweet } from "../utils/generateTweet";
import type { Tweet as TweetModel } from "@prisma/client";

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

  function postRandomTweet(generatedTweet: string) {
    postTweetMutation.mutate({
      tweet: generatedTweet,
    });
  }

  function generateTweet() {
    setIsPostingTweet((prev) => !prev);
    const random = Math.floor(Math.random() * 100);
    setGeneratedTweet(
      "Just finished up a project using #Typescript - so much fun and powerful! Definitely the way to go for large scale applications. #jsdevs" +
        random.toString()
    );

    // generateRandomTweet(userDetails?.personality || "")
    //   .then((generated) => {
    //     if (generated?.data?.choices[0]?.text === undefined) {
    //       throw new Error("Could not generate tweet");
    //     }
    //     setGeneratedTweet(generated?.data?.choices?.at(0)?.text || "");
    //     // postRandomTweet(generated?.data?.choices?.at(0)?.text || "");
    //   })
    //   .catch((err) => {
    //     console.log("Error generating tweet", err);
    //   });
  }

  return (
    <div className="w-full overflow-x-hidden pb-16">
      {isMobileBreakpoint ? (
        <div className="z-0">
          <div className="p-4">
            <p className="text-xl font-semibold">Litter</p>
          </div>
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
        <div
          onClick={generateTweet}
          className={`transition-all duration-300 ${
            isPostingTweet
              ? "fixed right-0 bottom-0 h-full w-full bg-black px-4 py-2 text-lg font-semibold text-white"
              : "fixed right-4 bottom-20 flex h-10 w-20 items-center justify-center rounded-md bg-black px-4 py-2 text-lg font-semibold text-white"
          }`}
        >
          {isPostingTweet ? (
            <div className="flex h-full w-full items-center justify-center text-white">
              <div className="text-2xl">{generatedTweet}</div>
            </div>
          ) : (
            <p>Yeet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
