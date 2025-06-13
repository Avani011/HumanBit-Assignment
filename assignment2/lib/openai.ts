import { openai } from "@ai-sdk/openai";
import { generateText, generateObject } from "ai";
import type { z } from "zod";

export async function generateWithOpenAI<T>(
  prompt: string,
  schema: z.ZodType<T>,
  systemPrompt?: string
): Promise<T> {
  try {
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
