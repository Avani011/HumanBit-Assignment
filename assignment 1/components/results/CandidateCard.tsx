"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Building,
  GraduationCap,
  MapPin,
  Users,
} from "lucide-react";
import type { CandidateProfile } from "@/types/api";

interface CandidateCardProps {
  candidate: CandidateProfile;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Card className="bg-[#2A2A2A] border-[#3A3A3A] hover:border-violet-500/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-[#3A3A3A] overflow-hidden">
              {candidate.profileImageUrl ? (
                <Image
                  src={candidate.profileImageUrl || "/placeholder.svg"}
                  alt={candidate.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Users className="w-8 h-8" />
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {candidate.name}
                </h3>
                <p className="text-gray-300">{candidate.headline}</p>
                <div className="flex items-center mt-1 text-sm text-gray-400">
                  <MapPin className="w-3 h-3 mr-1" />
                  {candidate.location}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-violet-500 text-violet-400 hover:bg-violet-500/10"
                onClick={() => window.open(candidate.profileUrl, "_blank")}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Profile
              </Button>
            </div>

            {/* Experience */}
            {candidate.experience && candidate.experience.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center text-sm font-medium text-gray-300 mb-1">
                  <Building className="w-3 h-3 mr-1" />
                  Experience
                </div>
                <div className="space-y-1">
                  {candidate.experience.slice(0, 2).map((exp, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-white">{exp.title}</span>
                      <span className="text-gray-400"> at </span>
                      <span className="text-emerald-400">{exp.company}</span>
                      {exp.duration && (
                        <span className="text-gray-500"> • {exp.duration}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {candidate.education && candidate.education.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center text-sm font-medium text-gray-300 mb-1">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Education
                </div>
                <div className="text-sm">
                  <span className="text-white">
                    {candidate.education[0].school}
                  </span>
                  {candidate.education[0].degree && (
                    <>
                      <span className="text-gray-400"> - </span>
                      <span className="text-gray-300">
                        {candidate.education[0].degree}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {candidate.skills.slice(0, 5).map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-[#3A3A3A] text-gray-300 hover:bg-[#4A4A4A]"
                  >
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 5 && (
                  <Badge
                    variant="secondary"
                    className="bg-[#3A3A3A] text-gray-400"
                  >
                    +{candidate.skills.length - 5} more
                  </Badge>
                )}
              </div>
            )}

            {/* Connection Info */}
            {(candidate.connectionDegree || candidate.sharedConnections) && (
              <div className="mt-3 text-xs text-gray-400 flex items-center">
                {candidate.connectionDegree && (
                  <span className="mr-3">
                    {candidate.connectionDegree === 1
                      ? "1st degree connection"
                      : `${candidate.connectionDegree}${
                          candidate.connectionDegree === 2 ? "nd" : "rd"
                        } degree connection`}
                  </span>
                )}
                {candidate.sharedConnections && (
                  <span>{candidate.sharedConnections} shared connections</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
