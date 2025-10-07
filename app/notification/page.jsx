"use client";

import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import NotificationTable from "./components/notificationTable";
import ProtectedLayout from "../components/ProtectedLayout";
import url from "../http/page"; // ✅ API base URL

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Fetch notifications
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${url}notification`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setNotifications(data.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Add/Edit notification
  const handleAction = async (formData, mode, id) => {
    try {
      let res;
      if (mode === "add") {
        res = await fetch(`${url}notification`, {
          method: "POST",
          body: formData,
        });
      } else if (mode === "edit") {
        res = await fetch(`${url}notification/${id}`, {
          method: "PUT",
          body: formData,
        });
      }
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to save notification:", err);
    }
  };

  // 🔹 Delete notification
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${url}notification/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <ProtectedLayout>
      <div className="flex min-h-screen bg-[#111827] text-white">
        <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
          <TopBar total={notifications.length} />
          <NotificationTable
            notifications={notifications}
            isLoading={isLoading}
            fetchNotifications={fetchNotifications}
            handleAction={handleAction}
            handleDelete={handleDelete}
          />
        </main>
      </div>
    </ProtectedLayout>
  );
}