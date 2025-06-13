import type React from "react";
export interface FilterSuggestion {
  id: string;
  value: string;
  count?: number;
}

export interface SelectedFilter {
  id: string;
  value: string;
  type: "include" | "exclude";
  category: string;
}

export interface FilterState {
  [key: string]: {
    query: string;
    suggestions: FilterSuggestion[];
    showSuggestions: boolean;
  };
}

export interface FilterConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  required: boolean;
}

export interface FilterInputProps {
  filterKey: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  state: {
    query: string;
    suggestions: FilterSuggestion[];
    showSuggestions: boolean;
  };
  onQueryChange: (filterKey: string, query: string) => void;
  onAddFilter: (
    filterKey: string,
    suggestion: FilterSuggestion,
    type: "include" | "exclude"
  ) => void;
  selectedFilters: SelectedFilter[];
  onRemoveFilter: (filterId: string, category: string) => void;
}

export interface FilterSummaryProps {
  selectedFilters: SelectedFilter[];
  onRemoveFilter: (filterId: string, category: string) => void;
}

export interface FiltersPanelProps {
  selectedFilters: SelectedFilter[];
  onFiltersChange: (filters: SelectedFilter[]) => void;
  useRealApi: boolean;
  setUseRealApi: (value: boolean) => void;
}
