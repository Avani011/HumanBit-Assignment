"use client";

import { useState, useCallback } from "react";
import { linkedinService } from "@/services/linkedinService";
import {
  generateMockResults,
  generateMockProfile,
} from "@/utils/mockDataGenerator";
import { mockSuggestions as mockSuggestionsData } from "@/data/mockData";
import type { FilterSuggestion } from "@/types/filters";
import type { CandidateProfile, SearchFilters } from "@/types/api";

export function useLinkedInApi() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<CandidateProfile[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  } | null>(null);
  const [apiCallsCount, setApiCallsCount] = useState<number>(0);
  const [remainingApiCalls, setRemainingApiCalls] = useState<number>(20);

  /**
   * Track API call
   */
  const trackApiCall = useCallback(() => {
    setApiCallsCount((prev) => prev + 1);
    setRemainingApiCalls((prev) => Math.max(0, prev - 1));
  }, []);

  /**
   * Reset API call counter
   */
  const resetApiCallCounter = useCallback(() => {
    setApiCallsCount(0);
    setRemainingApiCalls(20);
  }, []);

  /**
   * Check if API calls are available
   */
  const hasApiCallsRemaining = useCallback(() => {
    return remainingApiCalls > 0;
  }, [remainingApiCalls]);

  /**
   * Get filter suggestions based on query
   */
  const getSuggestions = useCallback(
    async (filterKey: string, query: string): Promise<FilterSuggestion[]> => {
      if (!query) return [];

      setError(null);

      try {
        if (!mockSuggestionsData[filterKey]) {
          console.warn(`No mock data available for filter type: ${filterKey}`);
          return [];
        }

        // Always return mock suggestions first for immediate UI response
        const mockResults = mockSuggestionsData[filterKey]
          .filter((s) => s.value.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5);

        // If using real API, make the call but don't wait for it
        if (hasApiCallsRemaining()) {
          trackApiCall();
          linkedinService
            .getSuggestions(filterKey, query)
            .then((response) => {
              console.log(`API suggestions for ${filterKey}:`, response);
            })
            .catch((err) => {
              console.error(
                `Error fetching API suggestions for ${filterKey}:`,
                err
              );
            });
        }

        return mockResults;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return [];
      }
    },
    [trackApiCall, hasApiCallsRemaining]
  );

  /**
   * Search for candidates with filters
   */
  const searchCandidates = useCallback(
    async (filters: SearchFilters, useRealApi = false) => {
      setIsLoading(true);
      setError(null);

      try {
        if (useRealApi && hasApiCallsRemaining()) {
          // Track API call
          trackApiCall();

          try {
            const response = await linkedinService.searchCandidates(filters);

            if (!response.success) {
              console.error("API search failed:", response.error);
              setError(
                typeof response.error === "string"
                  ? response.error
                  : response.error?.message || "Failed to search candidates"
              );

              // Fall back to mock data
              console.log("Falling back to mock data after API failure");
              const mockResults = generateMockResults(filters);
              setSearchResults(mockResults);
              setPagination({
                total: 120,
                page: filters.page || 1,
                pageSize: filters.pageSize || 10,
                hasMore: (filters.page || 1) < 12,
              });
              return;
            }

            if (response.data) {
              setSearchResults(response.data.results);
              if (response.data.pagination) {
                setPagination(response.data.pagination);
              }
            }
          } catch (error) {
            console.error("Error during API search:", error);
            setError(
              error instanceof Error
                ? error.message
                : "An unexpected error occurred"
            );

            // Fall back to mock data
            console.log("Falling back to mock data after exception");
            const mockResults = generateMockResults(filters);
            setSearchResults(mockResults);
            setPagination({
              total: 120,
              page: filters.page || 1,
              pageSize: filters.pageSize || 10,
              hasMore: (filters.page || 1) < 12,
            });
          }
        } else {
          // Use mock data
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Generate mock results based on filters
          const mockResults = generateMockResults(filters);
          setSearchResults(mockResults);
          setPagination({
            total: 120,
            page: filters.page || 1,
            pageSize: filters.pageSize || 10,
            hasMore: (filters.page || 1) < 12, // 12 pages total
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setSearchResults([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    },
    [trackApiCall, hasApiCallsRemaining]
  );

  /**
   * Get candidate profile by ID
   */
  const getCandidateProfile = useCallback(
    async (
      profileId: string,
      useRealApi = false
    ): Promise<CandidateProfile | null> => {
      setError(null);

      try {
        if (useRealApi && hasApiCallsRemaining()) {
          // Track API call
          trackApiCall();

          const response = await linkedinService.getCandidateProfile(profileId);

          if (!response.success || !response.data?.profile) {
            setError(
              typeof response.error === "string"
                ? response.error
                : response.error?.message || "Failed to fetch profile"
            );
            // Fall back to mock data
            return generateMockProfile(profileId);
          }

          return response.data.profile;
        } else {
          // Use mock data
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Return mock profile
          return generateMockProfile(profileId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      }
    },
    [trackApiCall, hasApiCallsRemaining]
  );

  return {
    getSuggestions,
    searchCandidates,
    getCandidateProfile,
    searchResults,
    pagination,
    isLoading,
    error,
    apiCallsCount,
    remainingApiCalls,
    resetApiCallCounter,
    hasApiCallsRemaining,
  };
}
