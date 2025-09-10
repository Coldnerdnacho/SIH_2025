"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit, Search, Plus, Eye } from "lucide-react"
import { supabase } from "@/CreateClient"

interface Patient {
  id: string
  name: string
  age: string
  height: string
  weight: string
  workplace: string
  address: string
  aadhaar: string
  uniqueId: string
  history: string
  medicines: string
  allergies: string
  permanentConditions: string
  photo?: string
  prescription?: string
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch patients from Supabase
  const fetchPatients = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("patients").select("*").order("name", { ascending: true })
    if (error) {
      console.error("Failed to fetch patients:", error)
      setPatients([])
      setFilteredPatients([])
    } else {
      setPatients(data)
      setFilteredPatients(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  // Filter patients based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPatients(patients)
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.uniqueId.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPatients(filtered)
    }
  }, [searchTerm, patients])

  // Delete patient from Supabase
  const deletePatient = async (patientId: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) return

    const { error } = await supabase.from("patients").delete().eq("id", patientId)
    if (error) {
      alert("Failed to delete patient: " + error.message)
      return
    }
    // Refresh the list after deletion
    fetchPatients()
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Patients</h1>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Link href="/patients/add">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </Link>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search Patient"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Patient List */}
        <Card>
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500 py-8">Loading patients...</p>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? "No patients found matching your search." : "No patients found"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 pb-2 border-b font-medium text-gray-700">
                  <div>Name</div>
                  <div>Unique ID</div>
                  <div>Age</div>
                  <div>Actions</div>
                </div>

                {/* Patient Rows */}
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="font-medium text-gray-900">{patient.name}</div>
                    <div className="text-gray-600">{patient.uniqueId}</div>
                    <div className="text-gray-600">{patient.age}</div>
                    <div className="flex gap-2">
                      <Link href={`/patients/view/${patient.id}`}>
                        <Button variant="secondary" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/patients/edit/${patient.id}`}>
                        <Button variant="outline" size="sm" className="bg-black text-white hover:bg-gray-800">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePatient(patient.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
