"use client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Wifi, Database } from "lucide-react";

interface ApiManagerProps {
  useRealApi: boolean;
  setUseRealApi: (value: boolean) => void;
  apiCallsCount: number;
  remainingApiCalls: number;
}

export function ApiManager({
  useRealApi,
  setUseRealApi,
  apiCallsCount,
  remainingApiCalls,
}: ApiManagerProps) {
  const handleToggleChange = (checked: boolean) => {
    setUseRealApi(checked);
  };

  return (
    <div className="mb-6 p-4 bg-[#2A2A2A] rounded-lg border border-[#3A3A3A]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Switch
            id="use-api"
            checked={useRealApi}
            onCheckedChange={handleToggleChange}
          />
          <Label
            htmlFor="use-api"
            className="font-medium cursor-pointer"
            onClick={() => setUseRealApi(!useRealApi)}
          >
            Use Real API
          </Label>
        </div>
        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              useRealApi ? "bg-emerald-500" : "bg-gray-500"
            }`}
          ></div>
          <span className="text-xs text-gray-400 flex items-center">
            {useRealApi ? (
              <>
                <Wifi className="w-3 h-3 mr-1" />
                API Connected
              </>
            ) : (
              <>
                <Database className="w-3 h-3 mr-1" />
                Using Mock Data
              </>
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-400">
          API Calls Made:{" "}
          <span className="text-violet-400 font-medium">{apiCallsCount}</span>
        </div>
        <div className="text-gray-400">
          Remaining:{" "}
          <span className="text-emerald-400 font-medium">
            {remainingApiCalls}
          </span>
        </div>
      </div>

      {useRealApi && remainingApiCalls < 5 && (
        <div className="mt-2 text-xs text-amber-400 flex items-center">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Warning: You&#39;re running low on API calls. Consider using mock
          data.
        </div>
      )}
    </div>
  );
}
