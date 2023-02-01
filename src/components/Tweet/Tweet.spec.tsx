import { render, screen } from "@testing-library/react";
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

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("next/router", () => require("next-router-mock"));

jest.mock("@trpc/server", () => ({
  useQuery: jest
    .fn()
    .mockReturnValue({ data: { ...mockData }, isLoading: false, error: {} }),
}));

describe("Tweet component should", () => {
  test("render the supplied tweet correctly", async () => {
    render(<Tweet tweet={mockData} />);
    const tweet = await screen.findByText("Hello, world!");
    expect(tweet).toBeInTheDocument();
    // expect(true).toBe(true);
  });
});
