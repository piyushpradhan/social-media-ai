import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const mongoRouter = createTRPCRouter({
  getUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input: { userId }, ctx }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
    }),
  updateUserPersonality: protectedProcedure
    .input(z.object({ personality: z.string() }))
    .mutation(async ({ input: { personality }, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          personality: personality,
        },
      });
    }),
  getTweets: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tweet.findMany({});
  }),
  postTweet: protectedProcedure
    .input(z.object({ tweet: z.string() }))
    .mutation(({ input: { tweet }, ctx }) => {
      return ctx.prisma.tweet.create({
        data: {
          tweet: tweet,
          likes: 0,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  deleteTweet: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .query(({ input: { tweetId }, ctx }) => {
      return ctx.prisma.tweet.delete({
        where: {
          id: tweetId,
        },
      });
    }),
  likeTweet: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ input: { tweetId }, ctx }) => {
      return ctx.prisma.tweet.update({
        where: {
          id: tweetId,
        },
        data: {
          likes: {
            increment: 1
          },
          likedBy: {
            connect: {
              id: ctx.session.user.id,
            }
          }
        }
      });
    }),
  unlikeTweet: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ input: { tweetId }, ctx }) => {
      return ctx.prisma.tweet.update({
        where: {
          id: tweetId,
        },
        data: {
          likes: {
            decrement: 1
          },
          likedBy: {
            disconnect: {
              id: ctx.session.user.id,
            }
          }
        }
      });
    }),
  postRetweet: protectedProcedure
    .input(z.object({ tweetId: z.string(), tweet: z.string() }))
    .mutation(async ({ input: { tweet, tweetId }, ctx }) => {
      await ctx.prisma.tweet.create({
        data: {
          tweet: tweet,
          likes: 0,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      return ctx.prisma.tweet.update({
        where: {
          id: tweetId
        },
        data: {
          retweetedBy: {
            connect: {
              id: ctx.session.user.id
            }
          }
        }
      });
    }),
  undoRetweet: protectedProcedure
    .input(z.object({ tweetId: z.string(), retweetId: z.string() }))
    .mutation(async ({ input: { tweetId, retweetId }, ctx }) => {
      await ctx.prisma.tweet.delete({
        where: {
          id: retweetId
        }
      });

      return ctx.prisma.tweet.update({
        where: {
          id: tweetId
        },
        data: {
          retweetedBy: {
            disconnect: {
              id: ctx.session.user.id
            }
          }
        }
      });
    }),
  getUserFromSession: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
  getTweetsFromUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.tweet.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
