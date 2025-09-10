import PatientRecord from "@/components/patient-record"
import Sidebar from "@/components/sidebar"

interface PageProps {
  params: {
    id: string
  }
}

export default function PatientViewPage({ params }: PageProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <PatientRecord patientId={params.id} />
      </main>
    </div>
  )
}
