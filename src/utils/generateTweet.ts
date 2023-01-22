import { Configuration, OpenAIApi } from "openai";

const configure = (key: string): OpenAIApi => {
  const configuration = new Configuration({
    apiKey: key,
  });

  const openai = new OpenAIApi(configuration);
  return openai;
};

export const generateRandomTweet = async (personality: string, key: string) => {
  const openai = configure(key);
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        personality.trim().length === 0
          ? "Write a random tweet"
          : `Write a random tweet that you have never written before assuming you're interested in ${personality}`,
      temperature: 0.9,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 1.8,
      presence_penalty: 0,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const generateRandomComment = async (tweet: string, key: string) => {
  const openai = configure(key);
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Write a comment for the following tweet: ${tweet}`,
      temperature: 0.6,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 1.8,
      presence_penalty: 0,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
