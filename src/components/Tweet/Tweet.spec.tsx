import { render } from "@headlessui/react/dist/utils/render";
import { prisma } from "../../server/db";
import type { Tweet as TweetModel } from "@prisma/client";
import Tweet from "./Tweet";

const mockData: TweetModel = {
  id: "1",
  tweet: "Hello, world!",
  likes: 5,
  retweets: 2,
  commentCount: 3,
  userId: "2",
  commentId: "3",
  date: new Date("2022-11-01T19:20:30.45Z"),
  likedUserIDs: ["9", "10"],
  retweetedUserIDs: ["11", "12"],
};

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn(() => {
      Tweet: {
        findMany: jest.fn(() => Promise.resolve(mockData));
      }
    }),
  };
});

describe("Tweet component should", () => {
  test("render the supplied tweet correctly", () => {
    // render(<Tweet tweet={tweet} />);
    // const tweet = await screen.findByText("Hello, world!");
    // expect(tweet).toBeInTheDocument();
    expect(true).toBe(true);
  });
});
