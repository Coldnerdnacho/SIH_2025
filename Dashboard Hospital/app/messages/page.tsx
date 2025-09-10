import Sidebar from "@/components/sidebar"

export default function MessagesPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Messages feature coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}
