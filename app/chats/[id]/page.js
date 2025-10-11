"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiSend,
  FiArrowLeft,
  FiUser,
  FiPackage,
  FiCheck,
  FiClock,
  FiEdit3,
  FiCheckCircle,
  FiXCircle,
  FiMail,
} from "react-icons/fi";
import ProtectedLayout from "../../components/ProtectedLayout";
import url from "../../http/page";

const AdminChatDetail = () => {
  const params = useParams();
  const router = useRouter();
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = url;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  useEffect(() => {
    if (params.id) {
      fetchChat();
    }
  }, [params.id]);

  const fetchChat = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}chats/${params.id}?userType=admin`
      );
      const result = await response.json();

      if (result.success) {
        setChat(result.data);
      } else {
        router.push("/chats");
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      router.push("/chats");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const response = await fetch(`${API_URL}chats/${params.id}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          sender: "admin",
          userId: "admin", // Admin identifier
        }),
      });

      const result = await response.json();
      if (result.success) {
        setChat(result.data);
      } else {
        console.error("Failed to send message:", result.message);
        setNewMessage(messageText); // Restore message on error
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setNewMessage(messageText); // Restore message on error
      alert("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const updateChatStatus = async (newStatus) => {
    try {
      const response = await fetch(`${API_URL}/chats/${params.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        setChat(result.data);
      }
    } catch (error) {
      console.error("Error updating chat status:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "resolved":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Chat not found
          </h2>
          <button
            onClick={() => router.push("/chats")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-background flex flex-col p-6">
        {/* Modern Header */}
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl mb-6 shadow-lg">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => router.push("/chats")}
                  className="p-3 hover:bg-secondary rounded-2xl transition-all duration-200 group"
                >
                  <FiArrowLeft className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all duration-200" />
                </button>

                {/* Customer & Product Info */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl overflow-hidden shadow-lg">
                      {chat.productId?.images?.[0]?.url ? (
                        <img
                          src={chat.productId.images[0].url}
                          alt={chat.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiPackage className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <FiUser className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground mb-1">
                      {chat.customerName}
                    </h1>
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <FiMail className="w-4 h-4" />
                        <span>{chat.customerEmail}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="px-2 py-1 bg-primary/20 text-primary rounded-lg text-xs font-medium">
                        {chat.productName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    chat.status
                  )}`}
                >
                  {chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
                </span>

                {chat.productId?.price && (
                  <span className="text-sm font-semibold text-blue-600">
                    Rs.
                    {(
                      chat.productId.offerPrice || chat.productId.price
                    ).toFixed(2)}
                  </span>
                )}

                <div className="flex items-center space-x-2">
                  {chat.status === "active" && (
                    <button
                      onClick={() => updateChatStatus("resolved")}
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-1"
                    >
                      <FiCheckCircle className="w-4 h-4" />
                      <span>Mark Resolved</span>
                    </button>
                  )}

                  {chat.status !== "closed" && (
                    <button
                      onClick={() => updateChatStatus("closed")}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
                    >
                      <FiXCircle className="w-4 h-4" />
                      <span>Close</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-6 mb-6 bg-card rounded-2xl p-6 border border-border">
              {chat.messages && chat.messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUser className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No messages yet
                  </h3>
                  <p className="text-muted-foreground">
                    This customer hasn&apos;t sent any messages about this
                    product.
                  </p>
                </div>
              ) : (
                chat.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "admin"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${
                        message.sender === "admin"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === "admin"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {message.sender === "admin" ? (
                          <FiEdit3 className="w-4 h-4" />
                        ) : (
                          <FiUser className="w-4 h-4" />
                        )}
                      </div>

                      {/* Message */}
                      <div
                        className={`p-4 rounded-2xl ${
                          message.sender === "admin"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary border border-border text-foreground"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.message}
                        </p>
                        <div
                          className={`flex items-center justify-end mt-2 space-x-1 ${
                            message.sender === "admin"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          <FiClock className="w-3 h-3" />
                          <span className="text-xs">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.sender === "admin" && (
                            <div className="text-xs ml-1">
                              {message.isRead ? (
                                <FiCheck className="w-3 h-3" />
                              ) : (
                                <FiCheck className="w-3 h-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Modern Input */}
            <div className="bg-card backdrop-blur-xl rounded-2xl p-6 border border-border shadow-xl">
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your response to help this customer..."
                    className="w-full px-6 py-4 border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-background text-foreground transition-all duration-200"
                    rows="1"
                    style={{ minHeight: "56px", maxHeight: "120px" }}
                    disabled={sending || chat.status === "closed"}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={
                    !newMessage.trim() || sending || chat.status === "closed"
                  }
                  className="p-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 group"
                >
                  {sending ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiSend className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                </button>
              </div>

              {chat.status === "closed" && (
                <p className="text-sm text-muted-foreground mt-2">
                  This chat has been closed. No new messages can be sent.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default AdminChatDetail;
