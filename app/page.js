import { redirect } from "next/navigation"
import { AppSidebar } from "./components/app-sidebar"

export default function Home() {
  // Automatically redirect to /dashboard
  redirect("/dashboard")

  // Optional: keep layout structure (not rendered because of redirect)
  return (
    <div className="flex">
      <AppSidebar />
      <main className="flex-1 p-10">
        {/* Dashboard would have been here */}
      </main>
    </div>
  )
}
