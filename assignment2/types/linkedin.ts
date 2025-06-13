export interface LinkedInFilter {
  type:
    | "keywords"
    | "location"
    | "company"
    | "industry"
    | "title"
    | "experience"
    | "skills";
  value: string;
  priority: number;
}

export interface OptimizedFilters {
  filters: LinkedInFilter[];
  filterIds: Record<string, string>;
  fallbacks: Map<string, string[]>;
}

export interface LinkedInProfile {
  id: string;
  name: string;
  headline: string;
  company: string;
  location: string;
  profileUrl: string;
  skills: string[];
  connectionDegree: number;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
}
