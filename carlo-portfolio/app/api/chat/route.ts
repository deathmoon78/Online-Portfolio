import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { SYSTEM_PROMPT } from "@/lib/prompt";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Support both Groq (via OpenAI-compatible) and OpenAI
  const useGroq = !!process.env.GROQ_API_KEY;

  const client = useGroq
    ? createOpenAI({
        baseURL: "https://api.groq.com/openai/v1",
        apiKey: process.env.GROQ_API_KEY!,
      })
    : createOpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
      });

  const model = useGroq ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

  const result = await streamText({
    model: client(model),
    system: SYSTEM_PROMPT,
    messages,
    temperature: 0.8,
    maxTokens: 600,
  });

  return result.toDataStreamResponse();
}
