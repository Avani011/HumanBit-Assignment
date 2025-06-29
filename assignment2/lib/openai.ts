import { openai } from "@ai-sdk/openai";
import { generateText, generateObject } from "ai";
import type { z } from "zod";

// Check if OpenAI API key is defined
if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "Warning: OPENAI_API_KEY is not defined in environment variables"
  );
}

export async function generateWithOpenAI<T>(
  prompt: string,
  schema: z.ZodType<T>,
  systemPrompt?: string
): Promise<T> {
  try {
    // Make sure we have an API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not defined in environment variables");
    }

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema,
      prompt,
      system: systemPrompt,
    });

    return object;
  } catch (error) {
    console.error("Error generating with OpenAI:", error);
    throw new Error("Failed to generate content with OpenAI");
  }
}

export async function generateTextWithOpenAI(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  try {
    // Make sure we have an API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not defined in environment variables");
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system: systemPrompt,
    });

    return text;
  } catch (error) {
    console.error("Error generating text with OpenAI:", error);
    throw new Error("Failed to generate text with OpenAI");
  }
}
