import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const generateRandomTweet = async (personality: string) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: personality.trim().length === 0 ? "Write a random tweet" : `Write a random tweet that you have never written before assuming you're interested in ${personality}`,
      temperature: 0.9,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 1.8,
      presence_penalty: 0,
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const generateRandomComment = async (personality: string, tweet: string) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: personality.trim().length === 0 ? `Write a random comment for the following tweet: ${tweet}` : `Write a random tweet that you have never written before assuming you're interested in ${personality} for the following tweet: ${tweet}`,
      temperature: 0.9,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 1.8,
      presence_penalty: 0,
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};
