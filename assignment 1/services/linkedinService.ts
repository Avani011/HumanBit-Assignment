import apiClient from "./api";
import { API_CONFIG } from "@/lib/config";
import type {
  SuggestionResponse,
  SearchResultsResponse,
  SearchFilters,
  CandidateProfile,
} from "@/types/api";

/**
 * LinkedIn Sales Navigator API Service
 */
export const linkedinService = {
  /**
   * Get filter suggestions based on query
   */
  getSuggestions: async (
    filterType: string,
    query: string
  ): Promise<{
    success: boolean;
    suggestions: { id: string; value: string; count?: number }[];
    error?: string;
  }> => {
    try {
      // Try primary endpoint first
      let response = await apiClient.get<SuggestionResponse>(
        API_CONFIG.ENDPOINTS.SUGGESTIONS,
        {
          type: filterType,
          query,
        }
      );

      // If primary fails, try alternative endpoint
      if (!response.success) {
        console.log(
          "Primary suggestions endpoint failed, trying alternative..."
        );
        response = await apiClient.get<SuggestionResponse>(
          API_CONFIG.ENDPOINTS.ALT_SUGGESTIONS,
          {
            type: filterType,
            query,
          }
        );
      }

      if (!response.success || !response.data) {
        return {
          success: false,
          suggestions: [],
          error: response.error?.message || "Failed to fetch suggestions",
        };
      }

      return {
        success: true,
        suggestions: response.data.suggestions,
      };
    } catch (error) {
      console.error(`Error fetching ${filterType} suggestions:`, error);
      return {
        success: false,
        suggestions: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Search for candidates with filters
   */
  searchCandidates: async (
    filters: SearchFilters
  ): Promise<{
    success: boolean;
    results: CandidateProfile[];
    pagination?: {
      total: number;
      page: number;
      pageSize: number;
      hasMore: boolean;
    };
    error?: string;
  }> => {
    try {
      // Transform filters into the format expected by the API
      const apiFilters = transformFiltersForApi(filters);

      // Try primary endpoint first
      console.log(
        `Trying primary search endpoint: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH}`
      );
      let response = await apiClient.post<SearchResultsResponse>(
        API_CONFIG.ENDPOINTS.SEARCH,
        apiFilters
      );

      // If primary fails, try alternative endpoint
      if (!response.success) {
        console.log("Primary search endpoint failed, trying alternative...");
        response = await apiClient.post<SearchResultsResponse>(
          API_CONFIG.ENDPOINTS.ALT_SEARCH,
          apiFilters
        );
      }

      if (!response.success || !response.data) {
        return {
          success: false,
          results: [],
          error: response.error?.message || "Failed to search candidates",
        };
      }

      return {
        success: true,
        results: response.data.results,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error("Error searching candidates:", error);
      return {
        success: false,
        results: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Get candidate profile by ID
   */
  getCandidateProfile: async (
    profileId: string
  ): Promise<{
    success: boolean;
    profile?: CandidateProfile;
    error?: string;
  }> => {
    try {
      // Try primary endpoint first
      let response = await apiClient.get<CandidateProfile>(
        API_CONFIG.ENDPOINTS.PROFILE,
        {
          id: profileId,
        }
      );

      // If primary fails, try alternative endpoint
      if (!response.success) {
        console.log("Primary profile endpoint failed, trying alternative...");
        response = await apiClient.get<CandidateProfile>(
          API_CONFIG.ENDPOINTS.ALT_PROFILE,
          {
            id: profileId,
          }
        );
      }

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error?.message || "Failed to fetch profile",
        };
      }

      return {
        success: true,
        profile: response.data,
      };
    } catch (error) {
      console.error("Error fetching candidate profile:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

/**
 * Transform our internal filter format to the API's expected format
 */
function transformFiltersForApi(filters: SearchFilters): any {
  const apiFilters: any = {
    filters: {},
    pagination: {
      page: filters.page || 1,
      pageSize: filters.pageSize || 10,
    },
  };

  // Process included filters
  Object.entries(filters).forEach(([key, values]) => {
    if (
      !key.startsWith("excluded") &&
      key !== "page" &&
      key !== "pageSize" &&
      Array.isArray(values) &&
      values.length > 0
    ) {
      apiFilters.filters[key] = {
        include: values,
      };
    }
  });

  // Process excluded filters
  Object.entries(filters).forEach(([key, values]) => {
    if (
      key.startsWith("excluded") &&
      Array.isArray(values) &&
      values.length > 0
    ) {
      const originalKey =
        key.replace("excluded", "").charAt(0).toLowerCase() +
        key.replace("excluded", "").slice(1);

      if (!apiFilters.filters[originalKey]) {
        apiFilters.filters[originalKey] = {};
      }

      apiFilters.filters[originalKey].exclude = values;
    }
  });

  return apiFilters;
}
