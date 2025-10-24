"use client";

import React, { useState } from "react";
import { testApiConnection } from "../../lib/api-config";

export default function TestReturnsPage() {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = [];

    // Test 1: API Connection
    try {
      const connectionResult = await testApiConnection();
      results.push({
        test: "API Connection Test",
        status: connectionResult.success ? "✅ PASS" : "❌ FAIL",
        details: connectionResult,
      });
    } catch (error) {
      results.push({
        test: "API Connection Test",
        status: "❌ FAIL",
        details: error.message,
      });
    }

    // Test 2: Returns Service
    try {
      const returnService = (await import("../returns/services/returnService"))
        .default;
      const returnsResult = await returnService.getReturns(1, 5);
      results.push({
        test: "Returns Service Test",
        status: returnsResult.success ? "✅ PASS" : "❌ FAIL",
        details: returnsResult,
      });
    } catch (error) {
      results.push({
        test: "Returns Service Test",
        status: "❌ FAIL",
        details: error.message,
      });
    }

    // Test 3: Stats Service
    try {
      const returnService = (await import("../returns/services/returnService"))
        .default;
      const statsResult = await returnService.getStats();
      results.push({
        test: "Stats Service Test",
        status: statsResult.success ? "✅ PASS" : "❌ FAIL",
        details: statsResult,
      });
    } catch (error) {
      results.push({
        test: "Stats Service Test",
        status: "❌ FAIL",
        details: error.message,
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🧪 Dashboard Returns API Test
          </h1>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This page tests the dashboard's connection to the returns API. Use
              this to debug connection and loading issues.
            </p>

            <button
              onClick={runTests}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Running Tests..." : "Run API Tests"}
            </button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Test Results:
              </h2>

              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{result.test}</h3>
                    <span className="text-lg">{result.status}</span>
                  </div>

                  <div className="bg-gray-50 rounded p-3">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {typeof result.details === "object"
                        ? JSON.stringify(result.details, null, 2)
                        : result.details}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">
              Troubleshooting:
            </h3>
            <ul className="text-yellow-800 space-y-1 text-sm">
              <li>• If connection test fails: Backend server is not running</li>
              <li>• If returns service fails: Check database connection</li>
              <li>• If stats service fails: Check return data in database</li>
              <li>
                • To start backend: Run <code>./start-backend.sh</code> from
                project root
              </li>
            </ul>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Actions:</h3>
            <div className="space-y-2">
              <a
                href="/returns"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Returns Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
