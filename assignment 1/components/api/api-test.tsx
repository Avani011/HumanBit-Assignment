"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function ApiTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const testApiConnection = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Test the suggestions API endpoint
      const response = await fetch(
        "/api/linkedin/suggestions?filterKey=jobTitle&query=engineer"
      );
      const data = await response.json();

      if (data.success) {
        setTestResult({
          success: true,
          message: data._fallback
            ? "API test successful, but using fallback mock data. Check API credentials."
            : "API connection successful!",
        });
      } else {
        setTestResult({
          success: false,
          message: `API test failed: ${data.error?.message || "Unknown error"}`,
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `API test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
      <CardHeader>
        <CardTitle className="text-white text-lg">
          API Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Test your API connection to ensure the LinkedIn API is properly
            configured.
          </p>

          <Button
            onClick={testApiConnection}
            disabled={isLoading}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Test API Connection"
            )}
          </Button>

          {testResult && (
            <Alert
              variant={testResult.success ? "success" : "destructive"}
              className={
                testResult.success
                  ? "bg-emerald-900/20 border-emerald-900/50"
                  : "bg-red-900/20 border-red-900/50"
              }
            >
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
              <AlertDescription
                className={
                  testResult.success ? "text-emerald-300" : "text-red-300"
                }
              >
                {testResult.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
