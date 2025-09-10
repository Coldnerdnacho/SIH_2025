import Sidebar from "@/components/sidebar"
import PatientsPage from "@/components/patients-page"

export default function Patients() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <PatientsPage />
      </main>
    </div>
  )
}
