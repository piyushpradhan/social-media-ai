import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const mongoRouter = createTRPCRouter({
  getUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input: { userId }, ctx }) => {
      if (userId === "") {
        throw new Error("Invalid user Id");
      }
      return ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
    }),
  updateUserApiKey: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input: { key }, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          key: key,
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
  getSingleTweet: publicProcedure
    .input(z.object({ tweetId: z.string() }))
    .query(({ input: { tweetId }, ctx }) => {
      return ctx.prisma.tweet.findUnique({
        where: {
          id: tweetId,
        },
      });
    }),
  getTweets: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tweet.findMany({});
  }),
  getComments: publicProcedure
    .input(z.object({ tweetId: z.string() }))
    .query(({ input: { tweetId }, ctx }) => {
      return ctx.prisma.tweet.findMany({
        where: {
          commentId: tweetId,
        },
      });
    }),
  postTweet: protectedProcedure
    .input(z.object({ tweet: z.string() }))
    .mutation(({ input: { tweet }, ctx }) => {
      return ctx.prisma.tweet.create({
        data: {
          tweet: tweet,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  deleteTweet: protectedProcedure
    .input(z.object({ tweetId: z.string(), tweetUserId: z.string() }))
    .mutation(async ({ input: { tweetId, tweetUserId }, ctx }) => {
      if (tweetUserId !== ctx.session.user.id) {
        throw new Error("Unauthroized");
      }
      await ctx.prisma.tweet.deleteMany({
        where: {
          commentId: tweetId,
        },
      });
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
            increment: 1,
          },
          likedBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
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
            decrement: 1,
          },
          likedBy: {
            disconnect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  postComment: protectedProcedure
    .input(z.object({ tweetId: z.string(), comment: z.string() }))
    .mutation(async ({ input: { tweetId, comment }, ctx }) => {
      const createdComment = await ctx.prisma.tweet.create({
        data: {
          tweet: comment,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return ctx.prisma.tweet.update({
        where: {
          id: tweetId,
        },
        data: {
          commentCount: {
            increment: 1,
          },
          comments: {
            connect: {
              id: createdComment.id,
            },
          },
        },
      });
    }),
  deleteComment: protectedProcedure
    .input(z.object({ commentId: z.string(), tweetId: z.string() }))
    .mutation(async ({ input: { tweetId, commentId }, ctx }) => {
      await ctx.prisma.tweet.deleteMany({
        where: {
          commentId: commentId,
        },
      });

      await ctx.prisma.tweet.delete({
        where: {
          id: commentId,
        },
      });

      return ctx.prisma.tweet.update({
        where: {
          id: tweetId,
        },
        data: {
          commentCount: {
            decrement: 1,
          },
          comments: {
            disconnect: {
              id: commentId,
            },
          },
        },
      });
    }),
  postRetweet: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
        tweet: z.string(),
        commentId: z.string().nullable(),
      })
    )
    .mutation(async ({ input: { tweet, tweetId, commentId }, ctx }) => {
      const createdRetweet = await ctx.prisma.tweet.create({
        data: {
          tweet: tweet,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      if (commentId) {
        await ctx.prisma.tweet.update({
          where: {
            id: commentId,
          },
          data: {
            commentCount: {
              increment: 1,
            },
            comments: {
              connect: {
                id: createdRetweet.id,
              },
            },
          },
        });
      }
      return ctx.prisma.tweet.update({
        where: {
          id: tweetId,
        },
        data: {
          retweets: {
            decrement: 1,
          },
          retweetedBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  undoRetweet: protectedProcedure
    .input(z.object({ tweetId: z.string(), retweetId: z.string() }))
    .mutation(async ({ input: { tweetId, retweetId }, ctx }) => {
      await ctx.prisma.tweet.delete({
        where: {
          id: retweetId,
        },
      });

      return ctx.prisma.tweet.update({
        where: {
          id: tweetId,
        },
        data: {
          retweetedBy: {
            disconnect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  getUserFromSession: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
  getTweetsFromCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.tweet.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getTweetsFromUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input: { id }, ctx }) => {
      return ctx.prisma.tweet.findMany({
        where: {
          userId: id,
        },
      });
    }),
});
