"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FilterPanel from "./FilterPanel";
import ResultsPanel from "./ResultsPanel";
import type { JobDescription } from "@/types/job";
import type { LinkedInProfile } from "@/types/linkedin";

interface SplitPanelProps {
  onJobDescriptionGenerated: (jobDescription: JobDescription) => void;
  jobDescription: JobDescription | null;
}

export default function SplitPanel({
  onJobDescriptionGenerated,
  jobDescription,
}: SplitPanelProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 10;
  // Add error state:
  const [error, setError] = useState<string | undefined>(undefined);

  // Update the handleSearch function to handle errors:
  const handleSearch = async (jobDesc: JobDescription) => {
    setIsSearching(true);
    setError(undefined);
    try {
      const response = await fetch("/api/linkedin/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobDesc),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to search LinkedIn");
      }

      setProfiles(data.profiles);
      setCurrentPage(1);

      if (data.profiles.length === 0 && data.message) {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error searching LinkedIn:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setProfiles([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Calculate current profiles to display
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = profiles.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );
  const totalPages = Math.ceil(profiles.length / profilesPerPage);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold gradient-text text-center mb-8"
      >
        AI-Powered Talent Search
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glassmorphism rounded-lg p-6"
        >
          <FilterPanel
            onJobDescriptionGenerated={onJobDescriptionGenerated}
            onSearch={handleSearch}
            jobDescription={jobDescription}
            isSearching={isSearching}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glassmorphism rounded-lg p-6"
        >
          <ResultsPanel
            profiles={currentProfiles}
            loading={isSearching}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            error={error}
          />
        </motion.div>
      </div>
    </div>
  );
}
