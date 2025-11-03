import OpenAI from "openai";

export function getOpenAIClient(apiKey: string) {
  if (!apiKey?.startsWith("sk-")) {
    throw new Error("Invalid API key");
  }
  return new OpenAI({ apiKey: apiKey.trim() });
}
