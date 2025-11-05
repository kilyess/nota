import OpenAI from "openai";

const openai = (apiKey: string) =>
  new OpenAI({
    apiKey,
  });

export default openai;
