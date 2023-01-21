import React from "react";
import type { Tweet } from "@prisma/client";

const SingleTweet = ({ tweet }: { tweet: Tweet }) => {
  return (
    <div className="h-screen w-screen">
      <h1>Single Tweet</h1>
    </div>
  );
};

export default SingleTweet;
