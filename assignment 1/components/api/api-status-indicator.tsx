"use client";

import { Wifi, Database, AlertTriangle } from "lucide-react";

interface ApiStatusIndicatorProps {
  usingRealApi: boolean;
  remainingApiCalls: number;
}

export function ApiStatusIndicator({
  usingRealApi,
  remainingApiCalls,
}: ApiStatusIndicatorProps) {
  return (
    <div className="flex items-center text-xs font-normal text-gray-400">
      {usingRealApi ? (
        <>
          <Wifi className="w-3 h-3 mr-1 text-emerald-400" />
          API Data
        </>
      ) : (
        <>
          <Database className="w-3 h-3 mr-1 text-amber-400" />
          Mock Data
        </>
      )}
      {usingRealApi && remainingApiCalls < 5 && (
        <span className="ml-2 text-amber-400 flex items-center">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Low API calls
        </span>
      )}
    </div>
  );
}
