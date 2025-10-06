// components/TopBar.jsx
"use client"

import { Bell } from "lucide-react"

const TopBar = ({ total }) => {
  return (
    <div className="flex justify-between items-center py-4 px-6 md:px-8 bg-gray-900 rounded-2xl shadow-lg border border-gray-700">
      <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Notification Management ✨
      </h1>
      <div className="flex items-center gap-6">
        <p className="hidden md:block text-gray-400 text-sm font-medium">
          Total: <span className="text-lg font-bold text-gray-200">{total}</span>
        </p>
        <button
          className="relative p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200 ease-in-out group"
          aria-label="Notifications"
        >
          <Bell className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors duration-200" />
          <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
        </button>
      </div>
    </div>
  )
}

export default TopBar