import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Tweet from "../components/Tweet";
import useMediaQuery from "../hooks/mediaQuery";
import { trpc } from "../utils/api";
import type { Tweet as TweetModel } from "@prisma/client";
import { useLoadingContext } from "../hooks/context/loadingContext";
import NewTweet from "../components/NewTweet";

const Feed: NextPage = () => {
  const isMobileBreakpoint = useMediaQuery(425);
  const tweetsResponse = trpc.mongo.getTweets.useQuery().data;
  const userDetails = trpc.mongo.getUserFromSession.useQuery().data;
  const [tweets, setTweets] = useState<TweetModel[]>([]);

  const loadingContext = useLoadingContext();

  useEffect(() => {
    if (tweetsResponse !== undefined) {
      setTweets(tweetsResponse);
      loadingContext?.toggleLoading(false);
    }
  }, [tweetsResponse]);

  return (
    <div className="w-full overflow-x-hidden pb-16">
      {isMobileBreakpoint ? (
        <div className="z-0">
          <div className="flex flex-col-reverse space-y-2 pb-6 pt-4">
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
      {isMobileBreakpoint && userDetails && (
        <NewTweet userDetails={userDetails} />
      )}
    </div>
  );
};

export default Feed;
