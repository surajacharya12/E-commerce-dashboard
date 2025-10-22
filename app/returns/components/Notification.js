import React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl border-l-4 transform transition-all duration-300 ease-in-out ${
        notification.type === "success"
          ? "bg-green-50 border-green-400 text-green-800"
          : notification.type === "error"
          ? "bg-red-50 border-red-400 text-red-800"
          : "bg-blue-50 border-blue-400 text-blue-800"
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {notification.type === "success" && (
            <CheckCircle className="w-5 h-5 text-green-600" />
          )}
          {notification.type === "error" && (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
          {notification.type === "info" && (
            <AlertCircle className="w-5 h-5 text-blue-600" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium">{notification.message}</p>
          <p className="text-xs opacity-75 mt-1">
            {new Date(notification.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
