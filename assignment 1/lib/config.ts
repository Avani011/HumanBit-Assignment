export const API_CONFIG = {
  // Base URL without trailing slash
  BASE_URL:
    "https://linkedin-sales-navigator-no-cookies-required.p.rapidapi.com",
  ENDPOINTS: {
    // Let's try some common RapidAPI endpoint patterns
    SUGGESTIONS: "/api/v1/suggestions", // More specific versioned endpoint
    SEARCH: "/api/v1/search", // Back to /search but with versioning
    PROFILE: "/api/v1/profile",
    // Alternative endpoints to try
    ALT_SUGGESTIONS: "/suggestions",
    ALT_SEARCH: "/search",
    ALT_PROFILE: "/profile",
  },
  DEFAULT_HEADERS: {
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
    "X-RapidAPI-Host":
      "linkedin-sales-navigator-no-cookies-required.p.rapidapi.com", // Hardcoded to ensure consistency
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  RATE_LIMIT: {
    MAX_REQUESTS_PER_MINUTE: 10,
    RETRY_AFTER_MS: 60000,
  },
};

export const FILTER_TYPES = {
  JOB_TITLE: "jobTitle",
  COMPANY: "company",
  LOCATION: "location",
  EXPERIENCE_LEVEL: "experienceLevel",
  INDUSTRY: "industry",
  PROFILE_LANGUAGE: "profileLanguage",
  CURRENT_COMPANY: "currentCompany",
  PAST_COMPANY: "pastCompany",
  SCHOOL: "school",
  YEARS_OF_EXPERIENCE: "yearsOfExperience",
  FUNCTION: "function",
  SENIORITY_LEVEL: "seniorityLevel",
};
