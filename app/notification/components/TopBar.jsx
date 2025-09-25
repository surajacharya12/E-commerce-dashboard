// components/TopBar.jsx
"use client"

import { Bell } from "lucide-react"

const TopBar = ({ total }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-semibold text-gray-300">Notification Management</h1>
      <div className="flex items-center gap-4">
        <p className="text-gray-400 text-sm">Total Notifications: {total}</p>
        <button className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
          <Bell className="h-5 w-5 text-gray-300" />
        </button>
      </div>
    </div>
  )
}
export default TopBar