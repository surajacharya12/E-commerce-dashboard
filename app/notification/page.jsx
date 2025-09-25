// app/page.jsx
"use client"

import { useState } from "react"
import TopBar from "./components/TopBar"
import NotificationTable from "./components/notificationTable"

export default function Notification() {
  const [notifications, setNotifications] = useState([])

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar total={notifications.length} />
        <NotificationTable
          notifications={notifications}
          setNotifications={setNotifications}
        />
      </main>
    </div>
  )
}