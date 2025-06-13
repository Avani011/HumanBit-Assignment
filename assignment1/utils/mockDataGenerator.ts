import type { CandidateProfile, SearchFilters } from "@/types/api";

// Helper function to generate mock results based on filters
export function generateMockResults(
  filters: SearchFilters
): CandidateProfile[] {
  const results: CandidateProfile[] = [];
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const startIndex = (page - 1) * pageSize;

  for (let i = 0; i < pageSize; i++) {
    const index = startIndex + i;
    results.push({
      id: `profile-${index}`,
      name: `Candidate ${index + 1}`,
      headline: filters.jobTitle?.[0] || "Software Engineer",
      location: filters.location?.[0] || "San Francisco, CA",
      profileUrl: `https://linkedin.com/in/candidate-${index + 1}`,
      currentCompany: filters.company?.[0] || "Tech Company",
      currentRole: filters.jobTitle?.[0] || "Software Engineer",
      experience: [
        {
          title: filters.jobTitle?.[0] || "Software Engineer",
          company: filters.company?.[0] || "Tech Company",
          duration: "2020 - Present",
        },
        {
          title: "Previous Role",
          company: filters.pastCompany?.[0] || "Previous Company",
          duration: "2018 - 2020",
        },
      ],
      education: [
        {
          school: filters.school?.[0] || "University",
          degree: "Bachelor's Degree",
          fieldOfStudy: "Computer Science",
          years: "2014 - 2018",
        },
      ],
      skills: ["JavaScript", "React", "Node.js", "TypeScript", "GraphQL"],
      connectionDegree: 2,
      sharedConnections: 5,
    });
  }

  return results;
}

// Generate mock profile for individual profile requests
export function generateMockProfile(profileId: string): CandidateProfile {
  return {
    id: profileId,
    name: "John Doe",
    headline: "Senior Software Engineer",
    location: "San Francisco, CA",
    profileUrl: "https://linkedin.com/in/johndoe",
    currentCompany: "Tech Company",
    currentRole: "Senior Software Engineer",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Company",
        duration: "2020 - Present",
      },
      {
        title: "Software Engineer",
        company: "Previous Company",
        duration: "2018 - 2020",
      },
    ],
    education: [
      {
        school: "University of California",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        years: "2014 - 2018",
      },
    ],
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "GraphQL"],
    connectionDegree: 2,
    sharedConnections: 5,
  };
}
