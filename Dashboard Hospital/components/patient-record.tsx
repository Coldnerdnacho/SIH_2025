"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/CreateClient"

interface Patient {
  id: string
  reg_id: string
  name: string
  dob: string | null
  gender: string | null
  age: number | null
  phone: string | null
  email: string | null
  last_visit: string | null
}

interface MedicalRecord {
  id: string
  patient_id: string
  filename: string
  upload_date: string
  uploaded_by: string | null
  summary: string | null
  type: "pdf" | "prescription"
  storage_path: string | null
}

interface PatientPageProps {
  patientId: string
}

export default function PatientPage({ patientId }: PatientPageProps) {
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [originalPatient, setOriginalPatient] = useState<Patient | null>(null)
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [recordFile, setRecordFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)

  // Fetch patient data
  const fetchPatientData = async () => {
    setLoading(true)
    try {
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single()
      if (patientError || !patientData) throw patientError
      setPatient(patientData)
      setOriginalPatient(patientData)

      const { data: recordsData, error: recordsError } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", patientId)
        .order("upload_date", { ascending: false })
      if (recordsError) throw recordsError
      setMedicalRecords(recordsData || [])
    } catch (err) {
      console.error(err)
      alert("Failed to load patient data.")
      router.push("/patients")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatientData()
  }, [patientId])

  // Save changes to backend
  const handleSave = async () => {
    if (!patient) return
    try {
      const updateData = {
        name: patient.name || null,
        dob: patient.dob || null,
        gender: patient.gender || null,
        age: patient.age !== undefined && !isNaN(patient.age) ? Number(patient.age) : null,
        phone: patient.phone || null,
        email: patient.email || null,
        last_visit: patient.last_visit || null,
      }
      const { data, error } = await supabase
        .from("patients")
        .update(updateData)
        .eq("id", patient.id)
        .select()
      if (error) throw error

      setPatient(data[0])
      setOriginalPatient(data[0])
      setEditMode(false)
      alert("Patient updated successfully!")
    } catch (err) {
      console.error(err)
      alert("Failed to update patient info.")
    }
  }

  // Cancel editing and revert changes
  const handleCancel = () => {
    setPatient(originalPatient)
    setEditMode(false)
  }

  // Upload new record (only in view mode)
  const handleRecordUpload = async () => {
    if (!patient || !recordFile) return
    try {
      const fileName = `${Date.now()}-${recordFile.name}`
      const { error: uploadError } = await supabase.storage
        .from("medical-files")
        .upload(`${patient.id}/${fileName}`, recordFile, { upsert: true })
      if (uploadError) throw uploadError

      const { data: publicData } = supabase.storage.from("medical-files").getPublicUrl(`${patient.id}/${fileName}`)
      const { data: newRecord, error: insertError } = await supabase
        .from("medical_records")
        .insert([{
          patient_id: patient.id,
          filename: recordFile.name,
          upload_date: new Date().toISOString().split("T")[0],
          uploaded_by: "Staff",
          summary: null,
          type: "pdf",
          storage_path: publicData.publicUrl
        }])
        .select()
      if (insertError) throw insertError

      setMedicalRecords(prev => [newRecord[0], ...prev])
      setRecordFile(null)
    } catch (err) {
      console.error(err)
      alert("Failed to upload record.")
    }
  }

  // Delete a medical record
  const handleDeleteRecord = async (record: MedicalRecord) => {
    if (!confirm(`Are you sure you want to delete ${record.filename}?`)) return
    try {
      // 1️⃣ Delete from storage
      const filePath = `${record.patient_id}/${record.filename}`
      const { error: storageError } = await supabase
        .storage
        .from("medical-files")
        .remove([filePath])
      if (storageError) throw storageError

      // 2️⃣ Delete from database
      const { error: dbError } = await supabase
        .from("medical_records")
        .delete()
        .eq("id", record.id)
      if (dbError) throw dbError

      // 3️⃣ Update frontend
      setMedicalRecords(prev => prev.filter(r => r.id !== record.id))
      alert("Record deleted successfully!")
    } catch (err) {
      console.error(err)
      alert("Failed to delete record.")
    }
  }

  if (loading || !patient) return <p className="p-8">Loading...</p>

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">

      {/* Patient Info */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Patient Info</CardTitle>
          <div className="space-x-2">
            {editMode ? (
              <>
                <Button size="sm" onClick={handleSave}>Save Changes</Button>
                <Button size="sm" variant="secondary" onClick={handleCancel}>Cancel</Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setEditMode(true)}>Edit</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input value={patient.name} onChange={e => setPatient({ ...patient, name: e.target.value })} disabled={!editMode} />
          </div>
          <div>
            <Label>Reg ID</Label>
            <Input value={patient.reg_id} disabled />
          </div>
          <div>
            <Label>DOB</Label>
            <Input type="date" value={patient.dob || ""} onChange={e => setPatient({ ...patient, dob: e.target.value })} disabled={!editMode} />
          </div>
          <div>
            <Label>Age</Label>
            <Input type="number" value={patient.age || ""} onChange={e => setPatient({ ...patient, age: Number(e.target.value) })} disabled={!editMode} />
          </div>
          <div>
            <Label>Gender</Label>
            <Input value={patient.gender || ""} onChange={e => setPatient({ ...patient, gender: e.target.value })} disabled={!editMode} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={patient.phone || ""} onChange={e => setPatient({ ...patient, phone: e.target.value })} disabled={!editMode} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={patient.email || ""} onChange={e => setPatient({ ...patient, email: e.target.value })} disabled={!editMode} />
          </div>
          <div>
            <Label>Last Visit</Label>
            <Input type="date" value={patient.last_visit || ""} onChange={e => setPatient({ ...patient, last_visit: e.target.value })} disabled={!editMode} />
          </div>
        </CardContent>
      </Card>

      {/* Upload New Record (only in view mode) */}
      {!editMode && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Medical Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="record-file">Choose PDF File</Label>
            <Input id="record-file" type="file" accept="application/pdf" onChange={e => setRecordFile(e.target.files?.[0] || null)} />
            <Button onClick={handleRecordUpload} disabled={!recordFile}>Upload Record</Button>
          </CardContent>
        </Card>
      )}

      {/* Past Medical Records */}
      <Card>
        <CardHeader>
          <CardTitle>Past Medical Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {medicalRecords.length === 0 && <p>No records found.</p>}
          {medicalRecords.map(record => (
            <div key={record.id} className="border p-2 rounded flex justify-between items-center">
              <p>{record.filename} ({record.type})</p>
              <div className="space-x-2">
                {record.storage_path && (
                  <a href={record.storage_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    View
                  </a>
                )}
                <Button size="sm" variant="destructive" onClick={() => handleDeleteRecord(record)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  )
}
