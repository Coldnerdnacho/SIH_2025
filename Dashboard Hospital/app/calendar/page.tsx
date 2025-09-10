import Sidebar from "@/components/sidebar"

export default function CalendarPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Calendar</h1>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Calendar feature coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}
