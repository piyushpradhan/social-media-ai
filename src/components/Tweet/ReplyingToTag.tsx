import type { Tweet } from "@prisma/client";
import React from "react";
import { BiSubdirectoryRight } from "react-icons/bi";
import { trpc } from "../../utils/api";

type Props = {
  tweet: Tweet;
  scaled?: boolean;
};

const ReplyingToTag: React.FC<Props> = ({ tweet, scaled = false }: Props) => {
  const commentDetails = trpc.mongo.getSingleTweet.useQuery({
    tweetId: tweet.commentId ?? "",
  }).data;

  const commentUserDetails = trpc.mongo.getUser.useQuery({
    userId: commentDetails?.userId ?? "",
  }).data;
  return (
    <p
      className={`flex text-xs text-gray-500 ${
        scaled ? "pl-16" : "ml-3 pl-12"
      }`}
    >
      <BiSubdirectoryRight className="text-sm" /> Replying to{" "}
      <span className="font-medium">{commentUserDetails?.name}</span>
    </p>
  );
};

export default ReplyingToTag;
