import { NextResponse } from "next/server";
import { mockSuggestions } from "@/data/mockData";

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const filterKey = url.searchParams.get("filterKey") || "";
    const query = url.searchParams.get("query") || "";

    // Check if we have API credentials
    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
    const apiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST;

    // Log API configuration for debugging
    console.log("API Request:", {
      filterKey,
      query,
      hasApiKey: !!apiKey,
      hasApiHost: !!apiHost,
    });

    if (!apiKey || !apiHost) {
      console.log("Missing API credentials, using mock data");
      // Return mock data if no API credentials
      const filteredSuggestions =
        mockSuggestions[filterKey as keyof typeof mockSuggestions] || [];
      const results = filteredSuggestions
        .filter((s) => s.value.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);

      return NextResponse.json({ success: true, suggestions: results });
    }

    // Attempt to call the real API
    try {
      const response = await fetch(
        `https://${apiHost}/api/v1/suggestions?filterKey=${filterKey}&query=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": apiHost,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (apiError) {
      console.error("API Error:", apiError);

      // Fallback to mock data on API error
      const filteredSuggestions =
        mockSuggestions[filterKey as keyof typeof mockSuggestions] || [];
      const results = filteredSuggestions
        .filter((s) => s.value.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);

      return NextResponse.json({
        success: true,
        suggestions: results,
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
