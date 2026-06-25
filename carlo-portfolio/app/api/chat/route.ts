import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { SYSTEM_PROMPT } from "@/lib/prompt";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST() {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: "Say hello",
          },
        ],
      }),
    }
  );

  const data = await response.json();

  console.log(data);
  console.log(
  process.env.GROQ_API_KEY?.slice(0, 8)
);

  return Response.json(data);
}
