// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

export interface SuggestionResponse {
  suggestions: {
    id: string;
    value: string;
    count?: number;
  }[];
}

export interface SearchResultsResponse {
  results: CandidateProfile[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

export interface CandidateProfile {
  id: string;
  name: string;
  headline: string;
  location: string;
  profileUrl: string;
  profileImageUrl?: string;
  currentCompany?: string;
  currentRole?: string;
  experience: {
    title: string;
    company: string;
    duration: string;
  }[];
  education: {
    school: string;
    degree?: string;
    fieldOfStudy?: string;
    years?: string;
  }[];
  skills?: string[];
  connectionDegree?: number;
  sharedConnections?: number;
}

export interface SearchFilters {
  jobTitle?: string[];
  company?: string[];
  location?: string[];
  experienceLevel?: string[];
  industry?: string[];
  profileLanguage?: string[];
  currentCompany?: string[];
  pastCompany?: string[];
  school?: string[];
  yearsOfExperience?: string[];
  function?: string[];
  seniorityLevel?: string[];
  excludedJobTitle?: string[];
  excludedCompany?: string[];
  excludedLocation?: string[];
  excludedExperienceLevel?: string[];
  excludedIndustry?: string[];
  excludedProfileLanguage?: string[];
  excludedCurrentCompany?: string[];
  excludedPastCompany?: string[];
  excludedSchool?: string[];
  excludedYearsOfExperience?: string[];
  excludedFunction?: string[];
  excludedSeniorityLevel?: string[];
  page?: number;
  pageSize?: number;
  // Add index signature to allow string indexing
  [key: string]: string[] | number | undefined;
}
