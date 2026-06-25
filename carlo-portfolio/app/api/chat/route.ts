import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { SYSTEM_PROMPT } from "@/lib/prompt";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST() {
  console.log("TEST ROUTE HIT");

  return Response.json({
    success: true,
    message: "TEST ROUTE HIT",
    timestamp: Date.now(),
  });
}
