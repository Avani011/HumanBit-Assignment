"use client";

import { Search, Users, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { CandidateCard } from "./CandidateCard";
import { ApiStatusIndicator } from "@/components/api/api-status-indicator";
import type { CandidateProfile } from "@/types/api";

interface ResultsPanelProps {
  results: CandidateProfile[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  } | null;
  onLoadMore: () => void;
  usingRealApi: boolean;
  remainingApiCalls: number;
}

export function ResultsPanel({
  results,
  isLoading,
  error,
  pagination,
  onLoadMore,
  usingRealApi,
  remainingApiCalls,
}: ResultsPanelProps) {
  return (
    <div className="w-full h-full p-6">
      <Card className="bg-[#2A2A2A] border-[#3A3A3A] h-full min-h-[600px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-violet-400" />
            Search Results
            {pagination && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({pagination.total.toLocaleString()} candidates)
              </span>
            )}
            {results.length > 0 && (
              <span className="ml-2">
                <ApiStatusIndicator
                  usingRealApi={usingRealApi}
                  remainingApiCalls={remainingApiCalls}
                />
              </span>
            )}
          </CardTitle>
          {isLoading && (
            <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <Alert
              variant="destructive"
              className="mb-6 bg-red-900/20 border-red-900/50"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}

              {pagination && pagination.hasMore && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={onLoadMore}
                    disabled={isLoading}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More Results"
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-[#3A3A3A] rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-300">
                  {isLoading ? "Searching..." : "Ready for Search"}
                </h3>
                <p className="text-gray-400 max-w-md">
                  {isLoading
                    ? "Finding candidates that match your filters..."
                    : "Configure your filters and click Search to find candidates."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
