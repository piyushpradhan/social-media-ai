import { z } from "zod";
import { generateRandomTweet } from "../../../utils/generateTweet";
import { createTRPCRouter, protectedProcedure } from "../trpc";

// completely forgot about this
export const openaiRouter = createTRPCRouter({
  generateRandomTweet: protectedProcedure
    .input(z.object({ personality: z.string() }))
    .query(async ({ input: { personality }}) => {
    const tweet = await generateRandomTweet(personality, "");
    return tweet;
  }),
});
