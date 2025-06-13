import type {
  ApiResponse,
  SuggestionResponse,
  SearchResultsResponse,
  SearchFilters,
  CandidateProfile,
} from "@/types/api";

class LinkedInService {
  private baseUrl: string;
  private apiKey: string | null;
  private apiHost: string | null;

  constructor() {
    this.baseUrl = "/api/linkedin";
    this.apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || null;
    this.apiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST || null;

    console.log("API Client initialized with:", {
      baseUrl: this.baseUrl,
      hasApiKey: !!this.apiKey,
      hasApiHost: !!this.apiHost,
    });
  }

  async getSuggestions(
    filterKey: string,
    query: string
  ): Promise<ApiResponse<SuggestionResponse>> {
    try {
      const response = await fetch(
        `${
          this.baseUrl
        }/suggestions?filterKey=${filterKey}&query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return {
          success: false,
          error: {
            message: `API responded with status: ${response.status}`,
            code: "API_ERROR",
          },
        };
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
          code: "REQUEST_FAILED",
        },
      };
    }
  }

  async searchCandidates(
    filters: SearchFilters
  ): Promise<ApiResponse<SearchResultsResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return {
          success: false,
          error: {
            message: `API responded with status: ${response.status}`,
            code: "API_ERROR",
          },
        };
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching candidates:", error);
      return {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
          code: "REQUEST_FAILED",
        },
      };
    }
  }

  async getCandidateProfile(
    profileId: string
  ): Promise<ApiResponse<{ profile: CandidateProfile }>> {
    try {
      const response = await fetch(`${this.baseUrl}/profile/${profileId}`);

      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return {
          success: false,
          error: {
            message: `API responded with status: ${response.status}`,
            code: "API_ERROR",
          },
        };
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching profile:", error);
      return {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
          code: "REQUEST_FAILED",
        },
      };
    }
  }
}

export const linkedinService = new LinkedInService();
