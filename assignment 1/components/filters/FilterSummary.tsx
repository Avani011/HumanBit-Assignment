"use client";

import { Plus, Minus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FilterSummaryProps } from "@/types/filters";

export function FilterSummary({
  selectedFilters,
  onRemoveFilter,
}: FilterSummaryProps) {
  const includedFilters = selectedFilters.filter((f) => f.type === "include");
  const excludedFilters = selectedFilters.filter((f) => f.type === "exclude");

  if (selectedFilters.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">
      {includedFilters.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-emerald-400 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Included ({includedFilters.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {includedFilters.map((filter) => (
              <Badge
                key={`${filter.category}-${filter.id}`}
                className="bg-emerald-600/20 text-emerald-300 border-emerald-600/30 hover:bg-emerald-600/30 transition-colors"
              >
                {filter.value}
                <button
                  onClick={() => onRemoveFilter(filter.id, filter.category)}
                  className="ml-2 hover:text-emerald-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {excludedFilters.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-red-400 flex items-center">
            <Minus className="w-4 h-4 mr-2" />
            Excluded ({excludedFilters.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {excludedFilters.map((filter) => (
              <Badge
                key={`${filter.category}-${filter.id}`}
                className="bg-red-600/20 text-red-300 border-red-600/30 hover:bg-red-600/30 transition-colors"
              >
                {filter.value}
                <button
                  onClick={() => onRemoveFilter(filter.id, filter.category)}
                  className="ml-2 hover:text-red-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
