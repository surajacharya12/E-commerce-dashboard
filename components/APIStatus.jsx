"use client";
import React, { useState, useEffect } from "react";
import { checkAPIHealth } from "../app/api-health-check";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

const APIStatus = () => {
    const [status, setStatus] = useState({ loading: true, healthy: false, error: null });

    const checkStatus = async () => {
        setStatus({ loading: true, healthy: false, error: null });
        const result = await checkAPIHealth();
        setStatus({
            loading: false,
            healthy: result.success,
            error: result.success ? null : result.error
        });
    };

    useEffect(() => {
        checkStatus();
    }, []);

    return (
        <div className="mb-4 p-3 rounded-lg border">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {status.loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                    ) : status.healthy ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium">
                        API Status: {status.loading ? "Checking..." : status.healthy ? "Connected" : "Disconnected"}
                    </span>
                </div>
                <button
                    onClick={checkStatus}
                    className="text-xs text-blue-600 hover:text-blue-800"
                >
                    Refresh
                </button>
            </div>
            {status.error && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                    {status.error}
                </div>
            )}
        </div>
    );
};

export default APIStatus;