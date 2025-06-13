import { NextResponse } from "next/server";
import type { JobDescription } from "@/types/job";
import {
  optimizeLinkedInFilters,
  searchLinkedInProfiles,
} from "@/lib/linkedin";

export async function POST(req: Request) {
  try {
    const jobDescription = (await req.json()) as JobDescription;

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    // Step 1: Optimize LinkedIn filters using AI
    const optimizedFilters = await optimizeLinkedInFilters(jobDescription);

    // Step 2: Search for profiles using the optimized filters
    const profiles = await searchLinkedInProfiles(optimizedFilters);

    if (profiles.length === 0) {
      return NextResponse.json({
        profiles,
        message:
          "No profiles found. Try adjusting your job description or skills requirements.",
      });
    }

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error("Error searching LinkedIn:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Failed to search LinkedIn",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
