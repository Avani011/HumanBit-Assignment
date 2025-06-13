import { NextResponse } from "next/server";
import type { SearchFilters } from "@/types/api";
import { generateMockResults } from "@/utils/mockDataGenerator";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const filters: SearchFilters = await request.json();

    // Check if we have API credentials
    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
    const apiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST;

    // Log API configuration for debugging
    console.log("Search API Request:", {
      filters,
      hasApiKey: !!apiKey,
      hasApiHost: !!apiHost,
    });

    if (!apiKey || !apiHost) {
      console.log("Missing API credentials, using mock data");
      // Return mock data if no API credentials
      const mockResults = generateMockResults(filters);

      return NextResponse.json({
        success: true,
        results: mockResults,
        pagination: {
          total: 120,
          page: filters.page || 1,
          pageSize: filters.pageSize || 10,
          hasMore: (filters.page || 1) < 12,
        },
        _mock: true,
      });
    }

    // Attempt to call the real API
    try {
      const response = await fetch(`https://${apiHost}/api/v1/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": apiHost,
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (apiError) {
      console.error("API Error:", apiError);

      // Fallback to mock data on API error
      const mockResults = generateMockResults(filters);

      return NextResponse.json({
        success: true,
        results: mockResults,
        pagination: {
          total: 120,
          page: filters.page || 1,
          pageSize: filters.pageSize || 10,
          hasMore: (filters.page || 1) < 12,
        },
        _fallback: true,
        _error:
          apiError instanceof Error ? apiError.message : "Unknown API error",
      });
    }
  } catch (error) {
    console.error("Route handler error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
