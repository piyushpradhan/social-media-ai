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
    <div className="w-full overflow-x-hidden">
      {isMobileBreakpoint ? (
        <div className="flex flex-col-reverse justify-end space-y-2">
          {tweets?.reverse().map((tweet, index) => (
            <Tweet key={index} tweet={tweet} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col-reverse items-center justify-end">
          {tweets.map((tweet) => (
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
