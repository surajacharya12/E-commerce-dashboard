"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiMessageCircle,
  FiSearch,
  FiFilter,
  FiUser,
  FiPackage,
  FiClock,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiMail,
  FiPhone,
  FiMoreVertical,
  FiStar,
  FiTrendingUp,
  FiActivity,
  FiGrid,
  FiList,
  FiArrowRight,
} from "react-icons/fi";

const ModernAdminChats = () => {
  const [customerChats, setCustomerChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const router = useRouter();

  useEffect(() => {
    fetchChats();
  }, [statusFilter, pagination.page]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/chats/admin/all?page=${pagination.page}&limit=${pagination.limit}&status=${statusFilter}`
      );
      const result = await response.json();

      if (result.success) {
        setCustomerChats(result.data);
        setStats(result.stats);
        setPagination((prev) => ({
          ...prev,
          total: result.pagination.total,
          pages: result.pagination.pages,
        }));
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getLastMessage = (chats) => {
    if (!chats || chats.length === 0) return "No messages yet";

    // Get the most recent chat with messages
    const chatWithMessages = chats
      .filter((chat) => chat.messages && chat.messages.length > 0)
      .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))[0];

    if (!chatWithMessages) return "No messages yet";

    const lastMessage =
      chatWithMessages.messages[chatWithMessages.messages.length - 1];
    return lastMessage.message.length > 60
      ? lastMessage.message.substring(0, 60) + "..."
      : lastMessage.message;
  };

  const filteredCustomerChats = customerChats.filter(
    (customer) =>
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.chats.some((chat) =>
        chat.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getPriorityLevel = (customer) => {
    if (customer.totalUnread > 5) return "high";
    if (customer.totalUnread > 2) return "medium";
    return "low";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Modern Header */}
      <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FiMessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Customer Support Hub
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center">
                <FiActivity className="w-4 h-4 mr-2" />
                Manage conversations and support inquiries
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-xl transition-all duration-200 flex items-center space-x-2 text-foreground"
            >
              {viewMode === "grid" ? (
                <FiList className="w-4 h-4" />
              ) : (
                <FiGrid className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {viewMode === "grid" ? "List View" : "Grid View"}
              </span>
            </button>
          </div>
        </div>

        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-secondary/50 backdrop-blur-xl rounded-2xl p-6 border border-border hover:bg-secondary/70 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Customers
                </p>
                <p className="text-3xl font-bold text-blue-400">
                  {pagination.total}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Active conversations
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FiUser className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-secondary/50 backdrop-blur-xl rounded-2xl p-6 border border-border hover:bg-secondary/70 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Active Chats
                </p>
                <p className="text-3xl font-bold text-green-400">
                  {stats.statusCounts?.find((s) => s._id === "active")?.count ||
                    0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Needs attention
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FiTrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-secondary/50 backdrop-blur-xl rounded-2xl p-6 border border-border hover:bg-secondary/70 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Unread Messages
                </p>
                <p className="text-3xl font-bold text-red-400">
                  {stats.totalUnread || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Awaiting response
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FiMessageCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-secondary/50 backdrop-blur-xl rounded-2xl p-6 border border-border hover:bg-secondary/70 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Resolved Today
                </p>
                <p className="text-3xl font-bold text-purple-400">
                  {stats.statusCounts?.find((s) => s._id === "resolved")
                    ?.count || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Completed chats
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FiCheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Search and Filters */}
        <div className="bg-secondary/30 backdrop-blur-xl rounded-2xl p-6 border border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers, products, or messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-foreground"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiFilter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Status:
                </span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Chat List */}
      <div className="bg-card rounded-2xl border border-border p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FiMessageCircle className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        ) : filteredCustomerChats.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <FiMessageCircle className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {searchTerm ? "No customers found" : "No customer chats yet"}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms or filters"
                : "Customer conversations will appear here when they start asking questions about products"}
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredCustomerChats.map((customer) => (
              <div
                key={customer._id}
                className={`bg-secondary/30 backdrop-blur-xl rounded-2xl border border-border hover:bg-secondary/50 transition-all duration-300 group cursor-pointer ${
                  viewMode === "list" ? "p-6" : "p-6"
                }`}
                onClick={() => {
                  // Navigate to the most recent active chat or first chat in same tab
                  const activeChat =
                    customer.chats.find((chat) => chat.status === "active") ||
                    customer.chats[0];
                  if (activeChat) {
                    router.push(`/chats/${activeChat._id}`);
                  }
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FiUser className="w-7 h-7 text-white" />
                      </div>
                      {customer.totalUnread > 0 && (
                        <div
                          className={`absolute -top-2 -right-2 w-6 h-6 ${getPriorityColor(
                            getPriorityLevel(customer)
                          )} rounded-full flex items-center justify-center shadow-lg`}
                        >
                          <span className="text-xs font-bold text-white">
                            {customer.totalUnread > 9
                              ? "9+"
                              : customer.totalUnread}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors truncate">
                        {customer.customerName}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <FiMail className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground truncate">
                          {customer.customerEmail}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiClock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatTime(customer.lastActivity)}
                    </span>
                  </div>
                </div>

                {/* Chat Summary */}
                <div className="mb-4">
                  <p className="text-foreground text-sm leading-relaxed line-clamp-2">
                    {getLastMessage(customer.chats)}
                  </p>
                </div>

                {/* Products Preview */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiPackage className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      Products discussed:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {customer.chats.slice(0, 3).map((chat, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-secondary rounded-lg px-3 py-1"
                      >
                        {chat.productId?.images?.[0]?.url && (
                          <img
                            src={chat.productId.images[0].url}
                            alt={chat.productName}
                            className="w-6 h-6 rounded object-cover"
                          />
                        )}
                        <span className="text-xs font-medium text-foreground truncate max-w-24">
                          {chat.productName}
                        </span>
                      </div>
                    ))}
                    {customer.chats.length > 3 && (
                      <div className="bg-primary/20 text-primary rounded-lg px-3 py-1">
                        <span className="text-xs font-medium">
                          +{customer.chats.length - 3} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-muted-foreground">
                        {customer.activeChats} active
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-muted-foreground">
                        {customer.resolvedChats} resolved
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <span className="text-xs text-muted-foreground">
                        {customer.totalChats} total
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="bg-secondary/30 backdrop-blur-xl rounded-2xl p-4 border border-border">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 text-sm border border-border rounded-xl hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
                >
                  Previous
                </button>
                <span className="text-sm text-foreground">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 text-sm border border-border rounded-xl hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernAdminChats;
