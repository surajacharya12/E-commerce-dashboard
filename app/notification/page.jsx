"use client"

import { useState, useEffect } from "react"
import TopBar from "./components/TopBar"
import NotificationTable from "./components/notificationTable";
import url from "@/app/http/page"

export default function Notification() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    const res = await fetch(`${url}/notification`)
    const data = await res.json()
    setNotifications(data)
  }

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar total={notifications.length} />
        <NotificationTable />
      </main>
    </div>
  )
}