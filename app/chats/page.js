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
  FiCheckCircle,
  FiMail,
  FiTrendingUp,
  FiActivity,
  FiGrid,
  FiList,
  FiArrowRight,
} from "react-icons/fi";
import ProtectedLayout from "../components/ProtectedLayout";

const ModernAdminChats = () => {
  const [customerChats, setCustomerChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [viewMode, setViewMode] = useState("grid");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
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
        console.log("API Response:", result.data); // Debug log
        setCustomerChats(result.data);
        setPagination((prev) => ({
          ...prev,
          total: result.pagination.pages,
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

  const getLastMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) return "No messages yet";

    const lastMessage = chat.messages[chat.messages.length - 1];
    return lastMessage.message.length > 60
      ? lastMessage.message.substring(0, 60) + "..."
      : lastMessage.message;
  };

  // Flatten customer chats to individual product chats
  const flattenedChats = customerChats.flatMap((customer) =>
    customer.chats.map((chat) => ({
      ...chat,
      customerName: customer.customerName,
      customerEmail: customer.customerEmail,
      customerId: customer._id,
      lastActivity: chat.lastActivity || customer.lastActivity,
      unreadCount: chat.unreadCount?.admin || 0,
    }))
  );

  const filteredCustomerChats = flattenedChats.filter(
    (chat) =>
      chat.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityLevel = (chat) => {
    const unreadCount = chat.unreadCount || 0;
    if (unreadCount > 5) return "high";
    if (unreadCount > 2) return "medium";
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
    <ProtectedLayout>
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
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
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
                    {flattenedChats.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Product conversations
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
                    {
                      flattenedChats.filter((chat) => chat.status === "active")
                        .length
                    }
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
                    {flattenedChats.reduce((total, chat) => {
                      return total + (chat.unreadCount || 0);
                    }, 0)}
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
                    {
                      flattenedChats.filter(
                        (chat) => chat.status === "resolved"
                      ).length
                    }
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
              {filteredCustomerChats.map((chat) => (
                <div
                  key={chat._id}
                  className={`bg-secondary/30 backdrop-blur-xl rounded-2xl border border-border hover:bg-secondary/50 transition-all duration-300 group cursor-pointer ${
                    viewMode === "list" ? "p-6" : "p-6"
                  }`}
                  onClick={() => {
                    router.push(`/chats/${chat._id}`);
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {/* Product Image as main avatar */}
                        <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl overflow-hidden shadow-lg">
                          {chat.productId?.images?.[0]?.url ? (
                            <img
                              src={chat.productId.images[0].url}
                              alt={chat.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiPackage className="w-7 h-7 text-white" />
                            </div>
                          )}
                        </div>
                        {/* Customer avatar as small overlay */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                          <FiUser className="w-3 h-3 text-white" />
                        </div>
                        {(chat.unreadCount || 0) > 0 && (
                          <div
                            className={`absolute -top-2 -left-2 w-6 h-6 ${getPriorityColor(
                              getPriorityLevel(chat)
                            )} rounded-full flex items-center justify-center shadow-lg`}
                          >
                            <span className="text-xs font-bold text-white">
                              {(chat.unreadCount || 0) > 9
                                ? "9+"
                                : chat.unreadCount || 0}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors truncate">
                          {chat.productName}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <FiUser className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.customerName}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <FiMail className="w-4 h-4 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground truncate">
                            {chat.customerEmail}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <FiClock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatTime(chat.lastActivity)}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          chat.status === "active"
                            ? "bg-green-100 text-green-800"
                            : chat.status === "resolved"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {chat.status}
                      </span>
                    </div>
                  </div>

                  {/* Chat Summary */}
                  <div className="mb-4">
                    <p className="text-foreground text-sm leading-relaxed line-clamp-2">
                      {getLastMessage(chat)}
                    </p>
                  </div>

                  {/* Product Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FiPackage className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          Product Discussion
                        </span>
                      </div>
                      {chat.productId?.price && (
                        <span className="text-sm font-semibold text-blue-600">
                          Rs.{" "}
                          {(
                            chat.productId.offerPrice || chat.productId.price
                          ).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Status Indicator */}
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            chat.status === "active"
                              ? "bg-green-500"
                              : chat.status === "resolved"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                          }`}
                        ></div>
                        <span className="text-xs text-muted-foreground capitalize">
                          {chat.status}
                        </span>
                      </div>

                      {/* Messages Count */}
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">
                          {chat.messages?.length || 0} messages
                        </span>
                      </div>

                      {/* Unread Messages - Always show */}
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            (chat.unreadCount || 0) > 0
                              ? "bg-red-500 animate-pulse"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-xs font-medium ${
                            (chat.unreadCount || 0) > 0
                              ? "text-red-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {chat.unreadCount || 0} unread
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
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
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
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
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
    </ProtectedLayout>
  );
};

export default ModernAdminChats;
