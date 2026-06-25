import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { SYSTEM_PROMPT } from "@/lib/prompt";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  console.log("1. Route hit");

  const { messages } = await req.json();
  console.log("2. Parsed request");

  const client = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY!,
  });
  console.log("3. Client created");

  const result = streamText({
  model: client("llama-3.3-70b-versatile"),
  system: SYSTEM_PROMPT,
  messages,
});

const text = await result.text;

console.log("Generated text:", text);

return Response.json({ text });
}
