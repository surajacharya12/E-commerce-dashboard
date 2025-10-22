import React from "react";
import { XCircle } from "lucide-react";

const StatusIndicator = ({ dbStatus, onRetry }) => {
  return (
    <div
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
        dbStatus === "connected"
          ? "bg-green-100"
          : dbStatus === "saving"
          ? "bg-blue-100"
          : "bg-red-100"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          dbStatus === "connected"
            ? "bg-green-400 animate-pulse"
            : dbStatus === "saving"
            ? "bg-blue-400 animate-spin"
            : "bg-red-400 animate-pulse"
        }`}
      ></div>
      <span
        className={`text-xs font-medium ${
          dbStatus === "connected"
            ? "text-green-700"
            : dbStatus === "saving"
            ? "text-blue-700"
            : "text-red-700"
        }`}
      >
        {dbStatus === "connected"
          ? "API Connected"
          : dbStatus === "saving"
          ? "Saving..."
          : "API Disconnected"}
      </span>
      {dbStatus === "disconnected" && (
        <button
          onClick={onRetry}
          className="text-xs text-red-600 hover:text-red-800 underline ml-2"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default StatusIndicator;
