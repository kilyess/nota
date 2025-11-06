import OpenAI from "openai";

const openai = (apiKey: string) =>
  new OpenAI({
    apiKey,
    baseURL: "https://api.openai.com/v1",
  });

export default openai;
