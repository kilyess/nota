import OpenAI from "openai";

const openai = async (apiKey: string) => {
  return new OpenAI({
    apiKey,
  });
};

export default openai;
