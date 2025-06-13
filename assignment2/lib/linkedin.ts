import type { JobDescription } from "@/types/job";
import type { LinkedInProfile, OptimizedFilters } from "@/types/linkedin";
import {
  generateLinkedInFilters,
  prioritizeFilters,
  createFilterFallbacks,
} from "./filter";
import { generateWithOpenAI } from "./openai";
import { z } from "zod";

// Replace the entire mockLinkedInAPI function with this real API implementation:

async function callLinkedInAPI(
  endpoint: string,
  params: Record<string, any>
): Promise<any> {
  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost =
    process.env.RAPIDAPI_HOST || "linkedin-sales-navigator-data.p.rapidapi.com";

  if (!apiKey) {
    throw new Error("RAPIDAPI_KEY environment variable is not set");
  }

  const url = new URL(`https://${apiHost}/${endpoint}`);

  // Add query parameters
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": apiHost,
    },
  };

  try {
    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling LinkedIn API (${endpoint}):`, error);
    throw error;
  }
}

export async function optimizeLinkedInFilters(
  jobDescription: JobDescription
): Promise<OptimizedFilters> {
  // Step 1: Generate initial filters based on job description
  const initialFilters = await generateLinkedInFilters(jobDescription);

  // Step 2: Prioritize filters
  const prioritizedFilters = prioritizeFilters(initialFilters);

  // Step 3: Create fallbacks for certain filters
  const filterFallbacks = createFilterFallbacks(prioritizedFilters);

  // Step 4: Convert filters to API parameters and get filter IDs
  const filterParams: Record<string, string> = {};
  const filterIds: Record<string, string> = {};

  for (const filter of prioritizedFilters) {
    filterParams[filter.type] = filter.value;
  }

  try {
    // Get filter IDs from LinkedIn API
    const filterResponse = await callLinkedInAPI("searchFilters", filterParams);

    if (filterResponse && filterResponse.filters) {
      for (const [type, id] of Object.entries(filterResponse.filters)) {
        if (id) {
          filterIds[type] = id as string;
        }
      }
    }

    return {
      filters: prioritizedFilters,
      filterIds,
      fallbacks: filterFallbacks,
    };
  } catch (error) {
    console.error("Error optimizing LinkedIn filters:", error);
    // Return the filters without IDs in case of API failure
    return {
      filters: prioritizedFilters,
      filterIds: {},
      fallbacks: filterFallbacks,
    };
  }
}

export async function searchLinkedInProfiles(
  optimizedFilters: OptimizedFilters
): Promise<LinkedInProfile[]> {
  // Convert filter IDs to API parameters
  const searchParams: Record<string, string> = {};

  // Use filter IDs if available, otherwise use filter values
  for (const filter of optimizedFilters.filters) {
    const filterId = optimizedFilters.filterIds[filter.type];
    if (filterId) {
      searchParams[`${filter.type}Id`] = filterId;
    } else {
      searchParams[filter.type] = filter.value;
    }
  }

  try {
    // Search for profiles using LinkedIn API
    const searchResponse = await callLinkedInAPI("searchPeople", searchParams);

    if (!searchResponse.profiles || searchResponse.profiles.length < 10) {
      // If we don't have enough results, try fallbacks
      for (const filter of optimizedFilters.filters) {
        if (filter.type === "location") {
          const fallbacks = optimizedFilters.fallbacks.get(filter.value);

          if (fallbacks) {
            for (const fallback of fallbacks) {
              const fallbackParams = { ...searchParams, location: fallback };
              // Remove locationId if we're using a fallback location
              delete fallbackParams.locationId;

              try {
                const fallbackResponse = await callLinkedInAPI(
                  "searchPeople",
                  fallbackParams
                );

                if (
                  fallbackResponse.profiles &&
                  fallbackResponse.profiles.length >= 10
                ) {
                  return mapApiProfilesToLinkedInProfiles(
                    fallbackResponse.profiles
                  );
                }
              } catch (fallbackError) {
                console.error(
                  `Error with fallback location "${fallback}":`,
                  fallbackError
                );
                // Continue to the next fallback
              }
            }
          }
        }
      }
    }

    return searchResponse.profiles
      ? mapApiProfilesToLinkedInProfiles(searchResponse.profiles)
      : [];
  } catch (error) {
    console.error("Error searching LinkedIn profiles:", error);
    return [];
  }
}

// Add a helper function to map API response to our LinkedInProfile type:

function mapApiProfilesToLinkedInProfiles(
  apiProfiles: any[]
): LinkedInProfile[] {
  return apiProfiles.map((profile) => ({
    id: profile.id || `profile_${Math.random().toString(36).substring(2, 11)}`,
    name: profile.name || "Unknown",
    headline: profile.headline || "",
    company: profile.company || "",
    location: profile.location || "",
    profileUrl: profile.profileUrl || "",
    skills: Array.isArray(profile.skills)
      ? profile.skills
      : typeof profile.skills === "string"
      ? profile.skills.split(",")
      : [],
    connectionDegree: profile.connectionDegree || 3,
  }));
}

export async function analyzeProfileMatch(
  profile: LinkedInProfile,
  jobDescription: JobDescription
): Promise<number> {
  const matchSchema = z.object({
    score: z.number().min(0).max(100),
    reasons: z.array(z.string()),
  });

  const systemPrompt = `
    You are an expert at evaluating how well a candidate matches a job description.
    Analyze the candidate's profile against the job requirements and provide a match score from 0-100.
    Also provide reasons for your score.
  `;

  const prompt = `
    Analyze how well this candidate matches the job requirements:
    
    Job Description:
    Title: ${jobDescription.title}
    Location: ${jobDescription.location}
    Experience Level: ${jobDescription.experienceLevel}
    Skills: ${jobDescription.skills.join(", ")}
    Description: ${jobDescription.description}
    
    Candidate Profile:
    Name: ${profile.name}
    Headline: ${profile.headline}
    Company: ${profile.company}
    Location: ${profile.location}
    Skills: ${profile.skills.join(", ")}
    
    Return a match score from 0-100 and reasons for your score.
  `;

  const result = await generateWithOpenAI(prompt, matchSchema, systemPrompt);
  return result.score;
}
