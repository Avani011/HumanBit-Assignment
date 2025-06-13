"use client";

import { useState, useEffect, useCallback } from "react";
import { FilterInput } from "./FilterInput";
import { FilterSummary } from "./FilterSummary";
import { ApiManager } from "@/components/api/api-manager";
import { filterConfig } from "@/lib/filterConfig";
import { useLinkedInApi } from "@/hooks/useLinkedInApi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type {
  FilterState,
  FilterSuggestion,
  FiltersPanelProps,
} from "@/types/filters";
import { mockSuggestions as mockSuggestionsData } from "@/data/mockData";

export function FiltersPanel({
  selectedFilters,
  onFiltersChange,
  useRealApi,
  setUseRealApi,
}: FiltersPanelProps) {
  const [filterStates, setFilterStates] = useState<FilterState>({
    jobTitle: { query: "", suggestions: [], showSuggestions: false },
    company: { query: "", suggestions: [], showSuggestions: false },
    location: { query: "", suggestions: [], showSuggestions: false },
    experienceLevel: { query: "", suggestions: [], showSuggestions: false },
    industry: { query: "", suggestions: [], showSuggestions: false },
    profileLanguage: { query: "", suggestions: [], showSuggestions: false },
    currentCompany: { query: "", suggestions: [], showSuggestions: false },
    pastCompany: { query: "", suggestions: [], showSuggestions: false },
    school: { query: "", suggestions: [], showSuggestions: false },
    yearsOfExperience: { query: "", suggestions: [], showSuggestions: false },
    function: { query: "", suggestions: [], showSuggestions: false },
    seniorityLevel: { query: "", suggestions: [], showSuggestions: false },
  });

  const { getSuggestions, error, apiCallsCount, remainingApiCalls } =
    useLinkedInApi();
  const [apiError, setApiError] = useState<string | null>(null);

  // Update error state when API error changes
  useEffect(() => {
    setApiError(error);
  }, [error]);

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(
    async (filterKey: string, query: string) => {
      if (query.length === 0 || !useRealApi) return;

      try {
        // Try to get suggestions from API
        const suggestions = await getSuggestions(filterKey, query);

        if (suggestions.length > 0) {
          setFilterStates((prevState: FilterState) => ({
            ...prevState,
            [filterKey]: {
              ...prevState[filterKey],
              suggestions,
              showSuggestions: true,
            },
          }));
        }
      } catch (err) {
        console.error(`Error fetching suggestions for ${filterKey}:`, err);
      }
    },
    [getSuggestions, useRealApi]
  );

  // Create debounced version of fetchSuggestions (500ms delay)
  const debouncedFetchSuggestions = useCallback(
    (filterKey: string, query: string) => {
      const debouncedFn = () => {
        fetchSuggestions(filterKey, query);
      };

      setTimeout(debouncedFn, 500);
    },
    [fetchSuggestions]
  );

  const updateFilterQuery = useCallback(
    (filterKey: string, query: string) => {
      setFilterStates((prevState: FilterState) => ({
        ...prevState,
        [filterKey]: {
          ...prevState[filterKey],
          query,
          showSuggestions: query.length > 0,
        },
      }));

      if (query.length > 0) {
        // Always use mock data for immediate UI responsiveness
        const mockSuggestions = (mockSuggestionsData[filterKey] || [])
          .filter((s) => s.value.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5);

        setFilterStates((prevState: FilterState) => ({
          ...prevState,
          [filterKey]: {
            ...prevState[filterKey],
            suggestions: mockSuggestions,
            showSuggestions: true,
          },
        }));

        // Only fetch from API if real API is enabled
        if (useRealApi) {
          debouncedFetchSuggestions(filterKey, query);
        }
      }
    },
    [useRealApi, debouncedFetchSuggestions]
  );

  const addFilter = useCallback(
    (
      filterKey: string,
      suggestion: FilterSuggestion,
      type: "include" | "exclude"
    ) => {
      const exists = selectedFilters.find(
        (f) => f.id === suggestion.id && f.category === filterKey
      );
      if (!exists) {
        const newFilters = [
          ...selectedFilters,
          {
            id: suggestion.id,
            value: suggestion.value,
            type,
            category: filterKey,
          },
        ];
        onFiltersChange(newFilters);
      }

      setFilterStates((prevState: FilterState) => ({
        ...prevState,
        [filterKey]: {
          ...prevState[filterKey],
          query: "",
          suggestions: [],
          showSuggestions: false,
        },
      }));
    },
    [selectedFilters, onFiltersChange]
  );

  const removeFilter = useCallback(
    (filterId: string, category: string) => {
      const newFilters = selectedFilters.filter(
        (f) => !(f.id === filterId && f.category === category)
      );
      onFiltersChange(newFilters);
    },
    [selectedFilters, onFiltersChange]
  );

  const getFiltersByCategory = useCallback(
    (category: string) => {
      return selectedFilters.filter((f) => f.category === category);
    },
    [selectedFilters]
  );

  return (
    <div className="lg:w-1/2 xl:w-2/5 p-6 border-r border-[#3A3A3A]">
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
            Candidate Filter Platform
          </h1>
          <p className="text-gray-400">
            Find the perfect candidates with advanced filtering
          </p>
        </div>

        {/* API Manager */}
        <ApiManager
          useRealApi={useRealApi}
          setUseRealApi={setUseRealApi}
          apiCallsCount={apiCallsCount}
          remainingApiCalls={remainingApiCalls}
        />

        {/* API Error Alert */}
        {apiError && useRealApi && (
          <Alert
            variant="destructive"
            className="mb-6 bg-red-900/20 border-red-900/50"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        {/* Filter Sections */}
        <div className="space-y-6">
          {/* Required Filters */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-violet-400">
              Core Filters
            </h2>
            <div className="grid gap-4">
              {filterConfig
                .filter((f) => f.required)
                .map((filter) => (
                  <FilterInput
                    key={filter.key}
                    filterKey={filter.key}
                    label={filter.label}
                    icon={filter.icon}
                    state={filterStates[filter.key]}
                    onQueryChange={updateFilterQuery}
                    onAddFilter={addFilter}
                    selectedFilters={getFiltersByCategory(filter.key)}
                    onRemoveFilter={removeFilter}
                  />
                ))}
            </div>
          </div>

          {/* Optional Filters */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-emerald-400">
              Additional Filters
            </h2>
            <div className="grid gap-4">
              {filterConfig
                .filter((f) => !f.required)
                .map((filter) => (
                  <FilterInput
                    key={filter.key}
                    filterKey={filter.key}
                    label={filter.label}
                    icon={filter.icon}
                    state={filterStates[filter.key]}
                    onQueryChange={updateFilterQuery}
                    onAddFilter={addFilter}
                    selectedFilters={getFiltersByCategory(filter.key)}
                    onRemoveFilter={removeFilter}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        <FilterSummary
          selectedFilters={selectedFilters}
          onRemoveFilter={removeFilter}
        />
      </div>
    </div>
  );
}
