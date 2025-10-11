"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Grid, Tag, Layers, Box, MessagesSquare, Repeat, Type, ShoppingCart, Gift, Percent, Image, Bell, MapPin, LogOut, User, Clock
} from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import url from "../http/page"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Grid },
  { title: "Category", url: "/category", icon: Tag },
  { title: "Sub Category", url: "/subcategory", icon: Layers },
  { title: "Brand", url: "/brand", icon: Box },
  { title: "Variant", url: "/variant", icon: Repeat },
  { title: "Variant Type", url: "/varianttype", icon: Type },
  { title: "Order", url: "/order", icon: ShoppingCart },
  { title: "Coupon", url: "/coupon", icon: Gift },
  { title: "Customer Chats", url: "/chats", icon: MessagesSquare },
  { title: "Discount", url: "/discount", icon: Percent },
  { title: "Poster", url: "/poster", icon: Image },
  { title: "Notification", url: "/notification", icon: Bell },
  { title: "Store", url: "/store", icon: MapPin },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [chatStats, setChatStats] = useState({
    activeChats: 0,
    unreadChats: 0
  })

  const API_URL = url;

  // Fetch chat statistics
  const fetchChatStats = async () => {
    try {
      const response = await fetch(`${API_URL}chats/admin/all?page=1&limit=100&status=all`)
      const result = await response.json()

      if (result.success) {
        let activeChats = 0
        let unreadChats = 0

        result.data.forEach((customer) => {
          customer.chats.forEach((chat) => {
            // Count active chats
            if (chat.status === 'active') {
              activeChats++
            }

            // Count chats with unread messages
            if (chat.unreadCount?.admin > 0) {
              unreadChats++
            }
          })
        })

        setChatStats({
          activeChats,
          unreadChats
        })
      }
    } catch (error) {
      console.error("Error fetching chat stats:", error)
    }
  }

  // Fetch chat stats on component mount and set up polling
  useEffect(() => {
    fetchChatStats()

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchChatStats, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <img
              src="/assets/images/logo.png"
              alt="Logo"
              className="w-57 h-auto mx-auto mt-10"
            />
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-20">
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
                const isCustomerChats = item.title === "Customer Chats"

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center justify-between gap-2 px-4 py-2 rounded ${isActive
                          ? "bg-blue-500 text-white font-semibold"
                          : "hover:bg-gray-100"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>

                        {/* Chat Statistics for Customer Chats */}
                        {isCustomerChats && (chatStats.activeChats > 0 || chatStats.unreadChats > 0) && (
                          <div className="flex items-center space-x-1">
                            {/* Active Chats Badge */}
                            {chatStats.activeChats > 0 && (
                              <div className="flex items-center justify-center min-w-[20px] h-5 bg-green-500 text-white text-xs font-bold rounded-full px-1.5">
                                {chatStats.activeChats > 99 ? '99+' : chatStats.activeChats}
                              </div>
                            )}
                            {/* Unread Chats Badge */}
                            {chatStats.unreadChats > 0 && (
                              <div className="flex items-center justify-center min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 animate-pulse">
                                {chatStats.unreadChats > 99 ? '99+' : chatStats.unreadChats}
                              </div>
                            )}
                          </div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Profile Section at Bottom */}
      <SidebarFooter>
        <div className="p-4 border-t border-gray-200">
          {/* User Profile Info */}
          <div className="flex items-center space-x-3 mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user || 'Admin'}</p>
              <p className="text-xs text-gray-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Online
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}