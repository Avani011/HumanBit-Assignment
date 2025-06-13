import type { JobDescription } from "@/types/job";
import type { LinkedInFilter } from "@/types/linkedin";
import { generateWithOpenAI } from "./openai";
import { z } from "zod";

export async function generateLinkedInFilters(
  jobDescription: JobDescription
): Promise<LinkedInFilter[]> {
  const filterSchema = z.array(
    z.object({
      type: z.enum([
        "keywords",
        "location",
        "company",
        "industry",
        "title",
        "experience",
        "skills",
      ]),
      value: z.string(),
      priority: z.number().min(1).max(10),
    })
  );

  const systemPrompt = `
    You are an expert at optimizing LinkedIn search filters to find the best candidates.
    Based on the job description, create LinkedIn search filters that will yield relevant results.
    For each filter, assign a priority from 1-10 (10 being highest) to indicate its importance.
  `;

  const prompt = `
    Generate LinkedIn search filters based on this job description:
    
    Title: ${jobDescription.title}
    Location: ${jobDescription.location}
    Experience Level: ${jobDescription.experienceLevel}
    Skills: ${jobDescription.skills.join(", ")}
    Description: ${jobDescription.description}
    
    Create filters for keywords, location, title, experience level, and skills.
    Return an array of filter objects with type, value, and priority fields.
  `;

  return await generateWithOpenAI(prompt, filterSchema, systemPrompt);
}

export function prioritizeFilters(filters: LinkedInFilter[]): LinkedInFilter[] {
  // Sort filters by priority (highest first)
  return [...filters].sort((a, b) => b.priority - a.priority);
}

export function createFilterFallbacks(
  filters: LinkedInFilter[]
): Map<string, string[]> {
  const fallbacks = new Map<string, string[]>();

  // Create fallbacks for location filters
  const locationFilters = filters.filter((f) => f.type === "location");
  locationFilters.forEach((filter) => {
    const location = filter.value;
    const fallbackOptions: string[] = [];

    // Common city name variations
    if (location === "Bangalore") fallbackOptions.push("Bengaluru");
    if (location === "Bengaluru") fallbackOptions.push("Bangalore");
    if (location === "Mumbai") fallbackOptions.push("Bombay");
    if (location === "Chennai") fallbackOptions.push("Madras");
    if (location === "New York") fallbackOptions.push("NYC", "New York City");
    if (location === "San Francisco") fallbackOptions.push("SF", "Bay Area");

    // Add remote options
    fallbackOptions.push(`Remote ${location}`, `${location} Remote`);

    fallbacks.set(location, fallbackOptions);
  });

  return fallbacks;
}
