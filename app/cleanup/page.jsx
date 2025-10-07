"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import url from "../http/page";
import ProtectedLayout from "../components/ProtectedLayout";
import { Trash2, RefreshCw, Calendar, TrendingDown, DollarSign, AlertTriangle } from "lucide-react";

export default function CleanupPage() {
    const [stats, setStats] = useState({
        totalCancelled: 0,
        eligibleForRemoval: 0,
        totalValue: 0
    });
    const [loading, setLoading] = useState(true);
    const [cleanupLoading, setCleanupLoading] = useState(false);
    const [daysOld, setDaysOld] = useState(5);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${url}orders/stats/cancelled`);
            const result = await response.json();

            if (result.success) {
                setStats(result.data);
            } else {
                toast.error("Failed to fetch cleanup statistics");
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
            toast.error("Error fetching cleanup statistics");
        } finally {
            setLoading(false);
        }
    };

    const runCleanup = async () => {
        if (!confirm(`Are you sure you want to remove all cancelled orders older than ${daysOld} days? This action cannot be undone.`)) {
            return;
        }

        try {
            setCleanupLoading(true);
            const response = await fetch(`${url}orders/cleanup/cancelled`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ daysOld })
            });

            const result = await response.json();

            if (result.success) {
                toast.success(`Successfully removed ${result.data.removedCount} cancelled orders`);
                fetchStats(); // Refresh stats
            } else {
                toast.error(result.message || "Cleanup failed");
            }
        } catch (error) {
            console.error("Error running cleanup:", error);
            toast.error("Error running cleanup");
        } finally {
            setCleanupLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, description }) => (
        <div className="bg-[#2a2f45] rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="text-sm text-gray-400">{title}</p>
                </div>
            </div>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    );

    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-[#111827] text-white p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Order Cleanup Management</h1>
                            <p className="text-gray-400">Manage automatic cleanup of cancelled orders</p>
                        </div>
                        <button
                            onClick={fetchStats}
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            title="Total Cancelled Orders"
                            value={loading ? "..." : stats.totalCancelled}
                            icon={Calendar}
                            color="bg-yellow-600"
                            description="All cancelled orders in the system"
                        />
                        <StatCard
                            title="Eligible for Removal"
                            value={loading ? "..." : stats.eligibleForRemoval}
                            icon={AlertTriangle}
                            color="bg-red-600"
                            description={`Orders older than ${daysOld} days`}
                        />
                        <StatCard
                            title="Total Value"
                            value={loading ? "..." : `₹${stats.totalValue?.toLocaleString() || 0}`}
                            icon={DollarSign}
                            color="bg-green-600"
                            description="Combined value of cancelled orders"
                        />
                    </div>

                    {/* Cleanup Controls */}
                    <div className="bg-[#2a2f45] rounded-xl p-6 border border-gray-700 mb-8">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            Manual Cleanup
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Remove orders older than (days):
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={daysOld}
                                    onChange={(e) => setDaysOld(parseInt(e.target.value) || 5)}
                                    className="w-full bg-[#1e2235] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Default: 5 days (recommended)
                                </p>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={runCleanup}
                                    disabled={cleanupLoading || stats.eligibleForRemoval === 0}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {cleanupLoading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Running Cleanup...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Run Cleanup Now
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Information Panel */}
                    <div className="bg-[#2a2f45] rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-4">Automatic Cleanup Information</h2>

                        <div className="space-y-4 text-gray-300">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="font-semibold">Automatic Schedule</p>
                                    <p className="text-sm text-gray-400">Cleanup runs automatically every 24 hours</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="font-semibold">Retention Policy</p>
                                    <p className="text-sm text-gray-400">Cancelled orders are kept for 5 days before removal</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="font-semibold">Data Safety</p>
                                    <p className="text-sm text-gray-400">Only cancelled orders are affected. Active orders are never removed.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="font-semibold">Manual Override</p>
                                    <p className="text-sm text-gray-400">You can run cleanup manually with custom day settings</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
}