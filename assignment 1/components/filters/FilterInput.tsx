"use client";

import { Plus, Minus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { FilterInputProps } from "@/types/filters";

export function FilterInput({
  filterKey,
  label,
  icon: Icon,
  state,
  onQueryChange,
  onAddFilter,
  selectedFilters,
  onRemoveFilter,
}: FilterInputProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Label
          htmlFor={filterKey}
          className="text-sm font-medium text-gray-300 mb-2 flex items-center"
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </Label>
        <div className="relative">
          <Input
            id={filterKey}
            type="text"
            placeholder={`Search ${label.toLowerCase()}...`}
            value={state.query}
            onChange={(e) => onQueryChange(filterKey, e.target.value)}
            className="bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500/20 rounded-lg transition-all duration-200"
          />
        </div>

        {/* Suggestions Dropdown */}
        {state.showSuggestions && state.suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-1 bg-[#2A2A2A] border-[#3A3A3A] rounded-lg overflow-hidden z-10 shadow-xl">
            <div className="max-h-60 overflow-y-auto">
              {state.suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-3 hover:bg-[#3A3A3A] border-b border-[#3A3A3A] last:border-b-0 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-white font-medium">
                        {suggestion.value}
                      </span>
                      {suggestion.count && (
                        <span className="text-xs text-gray-400 ml-2">
                          ({suggestion.count.toLocaleString()})
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() =>
                          onAddFilter(filterKey, suggestion, "include")
                        }
                        className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-1 py-1 text-xs h-7"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Include
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          onAddFilter(filterKey, suggestion, "exclude")
                        }
                        className="flex items-center border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300 px-1 py-1 text-xs h-7"
                      >
                        <Minus className="w-3 h-3 mr-1" />
                        Exclude
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Selected filters for this category */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedFilters.map((filter) => (
            <Badge
              key={`${filter.category}-${filter.id}`}
              className={`text-xs ${
                filter.type === "include"
                  ? "bg-emerald-600/20 text-emerald-300 border-emerald-600/30"
                  : "bg-red-600/20 text-red-300 border-red-600/30"
              } hover:opacity-80 transition-opacity`}
            >
              {filter.value}
              <button
                onClick={() => onRemoveFilter(filter.id, filter.category)}
                className="ml-1 hover:opacity-70"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
