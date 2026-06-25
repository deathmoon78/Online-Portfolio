import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { SYSTEM_PROMPT } from "@/lib/prompt";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const client = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY!,
    });

    const result = await streamText({
      model: client("llama-3.3-70b-versatile"),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.8,
      maxTokens: 600,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("FULL ERROR:", error);

    return Response.json({
      error: String(error),
    });
  }
}
