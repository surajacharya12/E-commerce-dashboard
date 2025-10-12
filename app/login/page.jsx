"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiShield, FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simple authentication check
        if (username === "ShopSwift" && password === "ShopSwift123") {
            // Use auth context login (no localStorage persistence)
            login("ShopSwift");
            console.log("✅ Login successful - session will not persist across page refreshes");

            // Redirect to dashboard
            router.push("/dashboard");
        } else {
            setError("Invalid username or password");
        }

        setLoading(false);
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

                {/* Floating Orbs */}
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-bounce"></div>
            </div>

            {/* Centered Login Container */}
            <div className="relative z-10 flex items-center justify-center w-full h-full">
                <div className="w-full max-w-md">
                    {/* Main Login Card */}
                    <div className="bg-gray-900/80 backdrop-blur-2xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl shadow-black/50">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            {/* Logo */}
                            <div className="relative mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/25 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <FiShield className="w-10 h-10 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
                                ShopSwift
                            </h1>
                            <p className="text-gray-400 text-base font-medium">
                                Admin Dashboard
                            </p>
                            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-3"></div>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-300 text-sm backdrop-blur-sm animate-shake">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span>{error}</span>
                                    </div>
                                </div>
                            )}

                            {/* Username Field */}
                            <div className="space-y-2">
                                <label htmlFor="username" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                    Username
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="text"
                                            id="username"
                                            placeholder="Enter your username"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative">
                                        <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            placeholder="Enter your password"
                                            className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                            >
                                {/* Button Background Animation */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative flex items-center justify-center space-x-3">
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Authenticating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Access Dashboard</span>
                                            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center space-y-4">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="text-gray-400 text-sm">
                                    Secure Admin Portal
                                </p>
                            </div>

                            {/* Demo Credentials 
                            <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-3 backdrop-blur-sm">
                                <p className="text-gray-300 text-sm font-semibold mb-2">Demo Credentials</p>
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-xs">
                                        Username: <span className="text-blue-400 font-mono bg-gray-800/50 px-2 py-1 rounded">ShopSwift</span>
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        Password: <span className="text-purple-400 font-mono bg-gray-800/50 px-2 py-1 rounded">ShopSwift123</span>
                                    </p>
                                </div>
                            </div>*/}
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 border-2 border-blue-500/30 rounded-full"></div>
                    <div className="absolute -bottom-4 -right-4 w-6 h-6 border-2 border-purple-500/30 rounded-full"></div>
                    <div className="absolute top-1/2 -right-6 w-4 h-4 bg-indigo-500/30 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;