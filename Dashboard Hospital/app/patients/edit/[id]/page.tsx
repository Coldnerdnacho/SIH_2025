import Sidebar from "@/components/sidebar"
import PatientDetails from "@/components/patient-details"

interface EditPatientPageProps {
  params: {
    id: string
  }
}

export default function EditPatientPage({ params }: EditPatientPageProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <PatientDetails patientId={params.id} />
      </main>
    </div>
  )
}
