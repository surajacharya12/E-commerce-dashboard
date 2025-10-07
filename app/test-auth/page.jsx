"use client";

import ProtectedLayout from "../components/ProtectedLayout";
import { useAuth } from "../../hooks/useAuth";
import { FiClock, FiShield, FiCheck } from "react-icons/fi";

export default function TestAuth() {
    const { user, logout } = useAuth();

    return (
        <ProtectedLayout>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiShield className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Authentication Test Page
                        </h1>
                        <p className="text-gray-600">
                            This page is protected and only accessible after login
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Authentication Status */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <FiCheck className="w-6 h-6 text-green-600" />
                                <h3 className="text-lg font-semibold text-green-900">
                                    Authentication Status
                                </h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-green-700">
                                    <strong>Status:</strong> Authenticated ✅
                                </p>
                                <p className="text-green-700">
                                    <strong>User:</strong> {user}
                                </p>
                                <p className="text-green-700">
                                    <strong>Session:</strong> Active
                                </p>
                            </div>
                        </div>

                        {/* Session Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <FiClock className="w-6 h-6 text-blue-600" />
                                <h3 className="text-lg font-semibold text-blue-900">
                                    Session Information
                                </h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-blue-700">
                                    <strong>Login Time:</strong> Current session only
                                </p>
                                <p className="text-blue-700">
                                    <strong>Expires:</strong> On page refresh/close
                                </p>
                                <p className="text-blue-700">
                                    <strong>Storage:</strong> Memory only (no persistence)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Test Actions */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Test Actions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Refresh Page (Will Logout)
                            </button>
                            <button
                                onClick={() => window.location.href = "/dashboard"}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Go to Dashboard
                            </button>
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Test Logout
                            </button>
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                            <FiCheck className="w-4 h-4" />
                            <span className="font-medium">
                                🎉 Authentication system is working correctly!
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
}