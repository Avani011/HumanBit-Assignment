"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/component/ui/button";
import { Textarea } from "@/component/ui/textArea";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";
import type { JobDescription } from "@/types/job";

interface FilterPanelProps {
  onJobDescriptionGenerated: (jobDescription: JobDescription) => void;
  onSearch: (jobDescription: JobDescription) => void;
  jobDescription: JobDescription | null;
  isSearching: boolean;
}

export default function FilterPanel({
  onJobDescriptionGenerated,
  onSearch,
  jobDescription,
  isSearching,
}: FilterPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editedJobDescription, setEditedJobDescription] =
    useState<JobDescription | null>(jobDescription);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateDescription = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/openai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate job description");
      }

      onJobDescriptionGenerated(data);
      setEditedJobDescription(data);
    } catch (error) {
      console.error("Error generating job description:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate job description. Please check your OpenAI API key."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: keyof JobDescription, value: string) => {
    if (!editedJobDescription) return;

    setEditedJobDescription({
      ...editedJobDescription,
      [field]: value,
    });
  };

  const handleSkillChange = (index: number, value: string) => {
    if (!editedJobDescription) return;

    const updatedSkills = [...editedJobDescription.skills];
    updatedSkills[index] = value;

    setEditedJobDescription({
      ...editedJobDescription,
      skills: updatedSkills,
    });
  };

  const handleSearch = () => {
    if (editedJobDescription) {
      onSearch(editedJobDescription);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <Label htmlFor="prompt" className="text-lg font-bold mb-2 block">
          Job Role Prompt
        </Label>
        <div className="flex gap-2">
          <Textarea
            id="prompt"
            placeholder="e.g., Looking for a React Developer with AI experience in Bangalore"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-24 resize-none"
          />
        </div>
        {error && (
          <div className="mt-2 flex items-center text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{error}</span>
          </div>
        )}
        <Button
          onClick={handleGenerateDescription}
          disabled={isGenerating || !prompt.trim()}
          className="mt-2 w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Job Description
            </>
          )}
        </Button>
      </div>

      {editedJobDescription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 overflow-y-auto"
        >
          <Card className="bg-black/50 border border-purple-500/30">
            <CardHeader>
              <CardTitle className="gradient-text">Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">
                  Job Title
                </Label>
                <Input
                  id="title"
                  value={editedJobDescription.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  value={editedJobDescription.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="experience" className="text-sm font-medium">
                  Experience Level
                </Label>
                <Input
                  id="experience"
                  value={editedJobDescription.experienceLevel}
                  onChange={(e) =>
                    handleInputChange("experienceLevel", e.target.value)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Required Skills</Label>
                <div className="space-y-2 mt-1">
                  {editedJobDescription.skills.map((skill, index) => (
                    <Input
                      key={index}
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editedJobDescription.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="mt-1 h-24"
                />
              </div>

              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full gradient-border"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching LinkedIn...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Find Candidates
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
