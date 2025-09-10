import Sidebar from "@/components/sidebar"
import PatientDetails from "@/components/patient-details"

export default function AddPatient() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <PatientDetails />
      </main>
    </div>
  )
}
