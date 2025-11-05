import OpenAI from "openai";

const openai = (apiKey: string) =>
  new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

export default openai;
