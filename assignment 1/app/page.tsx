"use client";

import { useState, useEffect, useCallback } from "react";
import { FiltersPanel } from "@/components/filters/FilterPanel";
import { ResultsPanel } from "@/components/results/ResultsPanel";
import { useLinkedInApi } from "@/hooks/useLinkedInApi";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, X, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SelectedFilter } from "@/types/filters";
import type { SearchFilters } from "@/types/api";

export default function CandidateFilterPlatform() {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [useRealApi, setUseRealApi] = useState(false);

  const {
    searchCandidates,
    searchResults,
    pagination,
    isLoading,
    error,
    remainingApiCalls,
  } = useLinkedInApi();

  // Check if API key is configured
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
    if (!apiKey) {
      setApiKeyMissing(true);
      setUseRealApi(false);
    } else {
      console.log("API key is configured");
    }
  }, []);

  const handleFiltersChange = (filters: SelectedFilter[]) => {
    setSelectedFilters(filters);
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const handleUseRealApiChange = (value: boolean) => {
    console.log("API toggle changed:", value);
    setUseRealApi(value);
  };

  const prepareSearchFilters = useCallback((): SearchFilters => {
    const filters: SearchFilters = {
      page: currentPage,
      pageSize: 10,
    };

    // Group filters by category and type
    selectedFilters.forEach((filter) => {
      const { category, type, value } = filter;

      if (type === "include") {
        if (!filters[category]) {
          filters[category] = [];
        }
        (filters[category] as string[]).push(value);
      } else {
        const excludedKey = `excluded${
          category.charAt(0).toUpperCase() + category.slice(1)
        }` as keyof SearchFilters;
        if (!filters[excludedKey]) {
          filters[excludedKey] = [];
        }
        (filters[excludedKey] as string[]).push(value);
      }
    });

    return filters;
  }, [selectedFilters, currentPage]);

  const handleSearch = useCallback(() => {
    if (selectedFilters.length === 0) return;

    console.log("Performing search with real API:", useRealApi);
    const filters = prepareSearchFilters();
    searchCandidates(filters, useRealApi);
  }, [prepareSearchFilters, searchCandidates, selectedFilters, useRealApi]);

  const handleLoadMore = useCallback(() => {
    if (!pagination || !pagination.hasMore) return;

    setCurrentPage((prev) => prev + 1);
    const filters = prepareSearchFilters();
    filters.page = currentPage + 1;
    searchCandidates(filters, useRealApi);
  }, [
    pagination,
    currentPage,
    prepareSearchFilters,
    searchCandidates,
    useRealApi,
  ]);

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white font-['Inter',sans-serif]">
      {apiKeyMissing && (
        <div className="p-4">
          <Alert
            variant="destructive"
            className="bg-red-900/20 border-red-900/50"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              API configuration required. Please configure your API credentials
              in the environment variables.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        <FiltersPanel
          selectedFilters={selectedFilters}
          onFiltersChange={handleFiltersChange}
          useRealApi={useRealApi}
          setUseRealApi={handleUseRealApiChange}
        />

        <div className="lg:w-1/2 xl:w-3/5 flex flex-col">
          <div className="p-6 border-b border-[#3A3A3A]">
            <div className="flex gap-3">
              <Button
                onClick={handleSearch}
                disabled={isLoading || selectedFilters.length === 0}
                size="lg"
                className={`flex-1 font-semibold ${
                  useRealApi
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-violet-600 hover:bg-violet-700 text-white"
                }`}
              >
                <Search className="w-5 h-5 mr-2" />
                {isLoading
                  ? "Searching..."
                  : `Search Candidates ${
                      selectedFilters.length > 0
                        ? `(${selectedFilters.length})`
                        : ""
                    } ${useRealApi ? "- Live Data" : ""}`}
              </Button>

              {selectedFilters.length > 0 && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  size="lg"
                  className="border-[#3A3A3A] hover:bg-[#3A3A3A] text-gray-300"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            {useRealApi && (
              <div className="mt-2 text-xs text-amber-400 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Live data mode active - {remainingApiCalls} requests remaining
              </div>
            )}
          </div>

          <ResultsPanel
            results={searchResults}
            isLoading={isLoading}
            error={error}
            pagination={pagination}
            onLoadMore={handleLoadMore}
            usingRealApi={useRealApi}
            remainingApiCalls={remainingApiCalls}
          />
        </div>
      </div>
    </div>
  );
}
