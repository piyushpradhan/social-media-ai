import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Tweet from "../components/Tweet";
import useMediaQuery from "../hooks/mediaQuery";
import { trpc } from "../utils/api";
import type { Tweet as TweetModel } from "@prisma/client";
import { useLoadingContext } from "../hooks/context/loadingContext";
import NewTweet from "../components/NewTweet";
import SideNavBar from "../components/SideNavBar";

const Feed: NextPage = () => {
  const isMobileBreakpoint = useMediaQuery(500);
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
          <div className="flex h-screen flex-col space-y-2 overflow-y-auto pb-6">
            {tweets?.reverse().map((tweet, index) => (
              <Tweet key={index} tweet={tweet} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-screen flex-col items-center overflow-y-auto pb-16">
          {tweets.reverse().map((tweet) => (
            <div key={tweet.id} className="w-full max-w-3xl">
              <Tweet tweet={tweet} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
