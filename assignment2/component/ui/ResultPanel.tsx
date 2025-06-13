"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/component/ui/button";
import { Card, CardContent } from "@/component/ui/card";
import { Avatar, AvatarFallback } from "@/component/ui/avatar";
import { Badge } from "@/component/ui/badge";
import type { LinkedInProfile } from "@/types/linkedin";

interface ResultPanelProps {
  profiles: LinkedInProfile[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  error?: string;
}

export default function ResultPanel({
  profiles,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  error,
}: ResultPanelProps) {
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
        <p className="text-lg text-gray-300">
          Searching for the best candidates...
        </p>
        <p className="text-sm text-gray-400 mt-2">
          This may take a moment as we optimize LinkedIn filters
        </p>
      </div>
    );
  }

  if (!loading && (profiles.length === 0 || error)) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold mb-4">
          {error ? "Error" : "No Results Yet"}
        </h3>
        <p className="text-gray-400 max-w-md">
          {error
            ? error
            : 'Generate a job description and click "Find Candidates" to search for matching LinkedIn profiles.'}
        </p>
        {error && (
          <p className="text-sm text-gray-500 mt-4">
            Please check your API key and try again. If the problem persists,
            try adjusting your search criteria.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold gradient-text">Matching Candidates</h3>
        <Badge variant="outline" className="bg-purple-500/20">
          {profiles.length} results
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <AnimatePresence mode="wait">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-black/50 border border-white/10 hover:border-purple-500/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border border-purple-500/30">
                      <AvatarFallback className="bg-purple-900/30">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold">{profile.name}</h4>
                          <p className="text-sm text-gray-400">
                            {profile.headline}
                          </p>
                        </div>

                        <a
                          href={profile.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>

                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          {profile.company}
                        </p>
                        <p className="text-xs text-gray-500">
                          {profile.location}
                        </p>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {profile.skills.slice(0, 3).map((skill, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="bg-purple-900/20 text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {profile.skills.length > 3 && (
                          <Badge
                            variant="outline"
                            className="bg-transparent text-xs"
                          >
                            +{profile.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>

          <span className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
