import Sidebar from "@/components/sidebar"
import DashboardContent from "@/components/dashboard-content"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <DashboardContent />
      </main>
    </div>
  )
}
