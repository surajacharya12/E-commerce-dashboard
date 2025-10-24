"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, Download, RefreshCw } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import ProtectedLayout from "../components/ProtectedLayout";

// Import components
import StatusIndicator from "./components/StatusIndicator";
import Notification from "./components/Notification";
import StatsCards from "./components/StatsCards";
import FilterBar from "./components/FilterBar";
import ReturnsTable from "./components/ReturnsTable";

// Import service
import returnService from "./services/returnService";

const ReturnsManagement = () => {
  // State management
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    picked_up: 0,
    processing: 0,
    refunded: 0,
    cancelled: 0,
    totalAmount: 0,
  });

  // UI state
  const [notification, setNotification] = useState(null);
  const [selectedReturns, setSelectedReturns] = useState([]);
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [dbStatus, setDbStatus] = useState("connected");

  // Notification helper
  const showNotification = (message, type = "info") => {
    setNotification({ message, type, timestamp: Date.now() });
    setTimeout(() => setNotification(null), 6000);
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    loadReturns();
    loadStats();

    // Auto-fallback if loading takes too long
    const fallbackTimer = setTimeout(() => {
      if (loading) {
        console.log("🔧 Dashboard loading timeout, forcing data load");
        fetch("http://localhost:3001/returns/admin/all?limit=10")
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setReturns(data.data || []);
              setTotalPages(data.pagination?.totalPages || 1);
              setError("⚠️ Auto-loaded data after timeout");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.error("Auto-fallback failed:", err);
          });
      }
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [selectedStatus, currentPage]);

  // Load returns data
  const loadReturns = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "🔄 Loading returns - Page:",
        currentPage,
        "Status:",
        selectedStatus
      );

      const result = await returnService.getReturns(
        currentPage,
        10,
        selectedStatus
      );

      console.log("✅ Returns loaded successfully:", result);

      if (result && result.data) {
        setReturns(result.data);
        setTotalPages(result.pagination?.totalPages || 1);
        setDbStatus("connected");
      } else {
        console.log("⚠️ No data in result, using fallback");
        // Try direct API call as fallback
        const directResponse = await fetch(
          "http://localhost:3001/returns/admin/all?limit=10"
        );
        if (directResponse.ok) {
          const directData = await directResponse.json();
          setReturns(directData.data || []);
          setTotalPages(directData.pagination?.totalPages || 1);
          setDbStatus("connected");
        } else {
          throw new Error("Direct API call failed");
        }
      }
    } catch (err) {
      console.error("❌ Error loading returns:", err);

      // If API is not available, show mock data for development
      if (err.message.includes("connect to server")) {
        console.log("🔧 API not available, using mock data for development");

        const mockReturns = [
          {
            _id: "mock1",
            returnNumber: "RET001",
            orderNumber: "ORD001",
            returnStatus: "requested",
            returnAmount: 299.99,
            returnDate: new Date().toISOString(),
            userID: { name: "John Doe", email: "john@example.com" },
            items: [{ productName: "Sample Product" }],
          },
          {
            _id: "mock2",
            returnNumber: "RET002",
            orderNumber: "ORD002",
            returnStatus: "approved",
            returnAmount: 199.99,
            returnDate: new Date().toISOString(),
            userID: { name: "Jane Smith", email: "jane@example.com" },
            items: [{ productName: "Another Product" }],
          },
        ];

        setReturns(mockReturns);
        setTotalPages(1);
        setError("⚠️ Using mock data - Backend server not available");
        setDbStatus("disconnected");
      } else {
        setError(err.message || "Failed to load returns");
        setDbStatus("disconnected");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const result = await returnService.getStats();
      setStats(result.data);
      setDbStatus("connected");
    } catch (err) {
      console.error("Error loading stats:", err);
      setDbStatus("disconnected");
    }
  };

  // Test backend connection
  const testConnection = async () => {
    console.log("🔍 Testing backend connection...");
    const isConnected = await returnService.testConnection();
    console.log("📡 Connection test result:", isConnected);

    setDbStatus(isConnected ? "connected" : "disconnected");

    if (isConnected) {
      console.log("✅ Connection successful, loading data...");
      loadReturns();
      loadStats();
    } else {
      console.log("❌ Connection failed");
      setError(
        "Cannot connect to backend server. Please ensure the API server is running on port 3001."
      );
    }
  };

  // Update return status
  const updateReturnStatus = async (returnId, status, previousStatus) => {
    setUpdatingStatus(returnId);
    setDbStatus("saving");

    try {
      const result = await returnService.updateStatus(
        returnId,
        status,
        "",
        previousStatus
      );

      showNotification(
        result.message || `Return status updated successfully`,
        "success"
      );

      // Refresh data
      await loadReturns();
      await loadStats();

      setDbStatus("connected");
      return true;
    } catch (error) {
      let errorMessage = "Failed to save status change";
      if (error.message.includes("Failed to fetch")) {
        errorMessage =
          "Cannot connect to server. Please check if the backend is running on port 3001.";
        setDbStatus("disconnected");
      } else if (error.message.includes("500")) {
        errorMessage = "Server error. Please check the backend logs.";
        setDbStatus("disconnected");
      } else if (error.message.includes("404")) {
        errorMessage =
          "API endpoint not found. Please check the backend configuration.";
        setDbStatus("disconnected");
      } else {
        errorMessage = `Error: ${error.message}`;
        setDbStatus("disconnected");
      }

      showNotification(errorMessage, "error");
      setTimeout(() => setDbStatus("connected"), 5000);
      return false;
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Bulk status update
  const bulkUpdateStatus = async (status) => {
    if (selectedReturns.length === 0) {
      showNotification("Please select returns to update", "error");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to update ${selectedReturns.length} returns to ${status}?`
      )
    ) {
      return;
    }

    setBulkUpdating(true);

    try {
      const results = await returnService.bulkUpdateStatus(
        selectedReturns,
        status
      );

      if (results.success > 0 && results.failed === 0) {
        showNotification(
          `Successfully updated ${results.success} returns`,
          "success"
        );
      } else if (results.success > 0 && results.failed > 0) {
        showNotification(
          `Updated ${results.success} returns, ${results.failed} failed`,
          "info"
        );
      } else {
        showNotification(`Failed to update returns`, "error");
      }

      setSelectedReturns([]);
      await loadReturns();
      await loadStats();
    } catch (error) {
      showNotification(`Bulk update failed: ${error.message}`, "error");
    } finally {
      setBulkUpdating(false);
    }
  };

  // Selection handlers
  const handleSelectReturn = (returnId, checked) => {
    if (checked) {
      setSelectedReturns([...selectedReturns, returnId]);
    } else {
      setSelectedReturns(selectedReturns.filter((id) => id !== returnId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedReturns(returns.map((r) => r._id));
    } else {
      setSelectedReturns([]);
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    setSelectedReturns([]);
  };

  // Chart data
  const pieChartData = [
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "Approved", value: stats.approved, color: "#3b82f6" },
    { name: "Picked Up", value: stats.picked_up, color: "#8b5cf6" },
    { name: "Processing", value: stats.processing, color: "#6366f1" },
    { name: "Refunded", value: stats.refunded, color: "#10b981" },
    { name: "Rejected", value: stats.rejected, color: "#ef4444" },
    { name: "Cancelled", value: stats.cancelled, color: "#6b7280" },
  ].filter((item) => item.value > 0);

  return (
    <ProtectedLayout>
      <div className="p-6 space-y-6">
        {/* Notification */}
        <Notification
          notification={notification}
          onClose={() => setNotification(null)}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <RotateCcw className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Returns Management
              </h1>
              <p className="text-gray-600">Manage and track product returns</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <StatusIndicator dbStatus={dbStatus} onRetry={testConnection} />

            <button
              onClick={loadReturns}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>

            <button
              onClick={async () => {
                console.log("🔧 Force loading data...");
                try {
                  const response = await fetch(
                    "http://localhost:3001/returns/admin/all?limit=10"
                  );
                  const data = await response.json();
                  console.log("Direct API result:", data);
                  if (data.success) {
                    setReturns(data.data);
                    setTotalPages(data.pagination?.totalPages || 1);
                    setError(null);
                    setLoading(false);
                  }
                } catch (err) {
                  console.error("Direct API failed:", err);
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <span>Force Load</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Returns by Status
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Returns Overview
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pieChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          selectedReturns={selectedReturns}
          onBulkUpdate={bulkUpdateStatus}
          onClearSelection={() => setSelectedReturns([])}
          bulkUpdating={bulkUpdating}
          returns={returns}
        />

        {/* Returns Table */}
        <ReturnsTable
          returns={returns}
          loading={loading}
          error={error}
          selectedReturns={selectedReturns}
          onSelectReturn={handleSelectReturn}
          onSelectAll={handleSelectAll}
          updatingStatus={updatingStatus}
          onStatusUpdate={updateReturnStatus}
          onRetry={loadReturns}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
};

export default ReturnsManagement;
