"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Grid, Tag, Layers, Box, Repeat, Type, ShoppingCart, Gift, Percent, Image, Bell, MapPin, LogOut 
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
  { title: "Discount", url: "/discount", icon: Percent },
  { title: "Poster", url: "/poster", icon: Image },
  { title: "Notification", url: "/notification", icon: Bell },
  { title: "Store", url: "/store", icon: MapPin },
  { title: "Log Out", url: "#", icon: LogOut },
]

export function AppSidebar() {
  const pathname = usePathname()

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
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 px-4 py-2 rounded ${
                          isActive
                            ? "bg-blue-500 text-white font-semibold"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
