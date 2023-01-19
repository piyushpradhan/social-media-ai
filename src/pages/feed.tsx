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
  const [tweets, setTweets] = useState<TweetModel[]>([]);
  const tweetsResponse = trpc.mongo.getTweets.useQuery().data;
  const userDetails = trpc.mongo.getUserFromSession.useQuery().data;

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
    generateRandomTweet(userDetails?.personality || "")
      .then((generated) => {
        if (generated?.data?.choices[0]?.text === undefined) {
          throw new Error("Could not generate tweet");
        }
        postTweetMutation.mutate({
          tweet: generated?.data?.choices?.at(0)?.text || "",
        });
      })
      .catch((err) => {
        console.log("Error generating tweet", err);
      });
  }

  return (
    <div className="w-full overflow-x-hidden pb-16">
      {isMobileBreakpoint ? (
        <>
          <div className="p-4">
            <p className="text-xl font-semibold">Litter</p>
          </div>
          <div className="flex flex-col-reverse space-y-2 pb-4">
            {tweets?.map((tweet, index) => (
              <Tweet key={index} tweet={tweet} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="px-8 py-4 border-b border-black">
            <p className="text-2xl font-semibold">Litter</p>
          </div>
        </>
      )}
      {isMobileBreakpoint && (
        <button
          onClick={postRandomTweet}
          className="fixed right-4 bottom-20 rounded-md bg-black px-4 py-2 text-lg font-semibold text-white"
        >
          Post
        </button>
      )}
    </div>
  );
};

export default Feed;
