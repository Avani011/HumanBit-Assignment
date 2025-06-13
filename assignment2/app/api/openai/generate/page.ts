import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const jobDescriptionSchema = z.object({
      title: z.string().describe("The job title"),
      location: z.string().describe("The job location"),
      experienceLevel: z.string().describe("The required experience level"),
      skills: z.array(z.string()).describe("List of required skills"),
      description: z.string().describe("Detailed job description"),
    });

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: jobDescriptionSchema,
      prompt: `Generate a detailed job description based on the following prompt: "${prompt}". 
      Include a job title, location, experience level, at least 5 required skills, and a detailed description.`,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("Error generating job description:", error);
    return NextResponse.json(
      { error: "Failed to generate job description" },
      { status: 500 }
    );
  }
}
