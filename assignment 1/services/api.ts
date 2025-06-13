import { API_CONFIG } from "@/lib/config";
import type { ApiResponse } from "@/types/api";

/**
 * Base API client for making requests to the LinkedIn Sales Navigator API
 */
class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private requestsThisMinute = 0;
  private resetTime: number = Date.now() + 60000;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.headers = {
      ...API_CONFIG.DEFAULT_HEADERS,
    };

    // Log configuration on initialization
    console.log("API Client initialized with:", {
      baseUrl: this.baseUrl,
      endpoints: API_CONFIG.ENDPOINTS,
      host: this.headers["X-RapidAPI-Host"],
      hasApiKey: !!this.headers["X-RapidAPI-Key"],
    });
  }

  /**
   * Check if we've hit the rate limit and wait if necessary
   */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();

    // Reset counter if a minute has passed
    if (now > this.resetTime) {
      this.requestsThisMinute = 0;
      this.resetTime = now + 60000;
    }

    // If we've hit the rate limit, wait until reset
    if (
      this.requestsThisMinute >= API_CONFIG.RATE_LIMIT.MAX_REQUESTS_PER_MINUTE
    ) {
      const waitTime = this.resetTime - now;
      console.warn(
        `Rate limit reached. Waiting ${waitTime}ms before next request.`
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      this.requestsThisMinute = 0;
      this.resetTime = Date.now() + 60000;
    }

    this.requestsThisMinute++;
  }

  /**
   * Make a GET request to the API
   */
  async get<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    try {
      await this.checkRateLimit();

      // Ensure endpoint starts with a slash
      const formattedEndpoint = endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;
      const url = new URL(`${this.baseUrl}${formattedEndpoint}`);

      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      const fullUrl = url.toString();
      console.log(`[API] Making GET request to: ${fullUrl}`);
      console.log("[API] With headers:", JSON.stringify(this.headers, null, 2));

      // Use fetch with mode: 'cors' to ensure CORS is properly handled
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: this.headers,
        mode: "cors",
        credentials: "omit", // Don't send cookies
      });

      console.log(
        `[API] Response status: ${response.status} ${response.statusText}`
      );

      if (!response.ok) {
        console.error(`[API] Error: ${response.status} ${response.statusText}`);
        let errorMessage = `API error: ${response.status} ${response.statusText}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error("[API] Error response:", errorData);
        } catch (e) {
          console.error("[API] Could not parse error response");
        }

        return {
          success: false,
          error: {
            message: errorMessage,
            code: response.status.toString(),
          },
        };
      }

      const data = await response.json();
      console.log("[API] Response data:", data);
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("[API] Request failed:", error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          code: "NETWORK_ERROR",
        },
      };
    }
  }

  /**
   * Make a POST request to the API
   */
  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      await this.checkRateLimit();

      // Ensure endpoint starts with a slash
      const formattedEndpoint = endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;
      const fullUrl = `${this.baseUrl}${formattedEndpoint}`;

      console.log(`[API] Making POST request to: ${fullUrl}`);
      console.log("[API] With body:", JSON.stringify(body, null, 2));
      console.log("[API] With headers:", JSON.stringify(this.headers, null, 2));

      // Use fetch with mode: 'cors' to ensure CORS is properly handled
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
        mode: "cors",
        credentials: "omit", // Don't send cookies
      });

      console.log(
        `[API] Response status: ${response.status} ${response.statusText}`
      );

      if (!response.ok) {
        console.error(`[API] Error: ${response.status} ${response.statusText}`);
        let errorMessage = `API error: ${response.status} ${response.statusText}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error("[API] Error response:", errorData);
        } catch (e) {
          console.error("[API] Could not parse error response");
        }

        return {
          success: false,
          error: {
            message: errorMessage,
            code: response.status.toString(),
          },
        };
      }

      const data = await response.json();
      console.log("[API] Response data:", data);
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("[API] Request failed:", error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          code: "NETWORK_ERROR",
        },
      };
    }
  }
}

// Create a singleton instance
const apiClient = new ApiClient();

export default apiClient;
