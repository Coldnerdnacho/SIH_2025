"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  history: string | null
  medicines: string | null
  allergies: string | null
  permanent_conditions: string | null
}

interface PatientDetailsProps {
  patientId: string
}

export default function PatientDetails({ patientId }: PatientDetailsProps) {
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [originalPatient, setOriginalPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)

  // Fetch patient data
  const fetchPatient = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single()
      if (error || !data) throw error
      setPatient(data)
      setOriginalPatient(data)
    } catch (err) {
      console.error(err)
      alert("Failed to load patient data.")
      router.push("/patients")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatient()
  }, [patientId])

  // Save changes
  const handleSave = async () => {
    if (!patient) return
    setSaving(true)
    try {
      const updateData = {
        name: patient.name || null,
        dob: patient.dob || null,
        gender: patient.gender || null,
        age: patient.age !== undefined && !isNaN(patient.age) ? Number(patient.age) : null,
        phone: patient.phone || null,
        email: patient.email || null,
        history: patient.history || null,
        medicines: patient.medicines || null,
        allergies: patient.allergies || null,
        permanent_conditions: patient.permanent_conditions || null,
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
    } finally {
      setSaving(false)
    }
  }

  // Cancel editing
  const handleCancel = () => {
    setPatient(originalPatient)
    setEditMode(false)
  }

  if (loading || !patient) return <p className="p-8">Loading...</p>

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Patient Details</CardTitle>
          <div className="space-x-2">
            {editMode ? (
              <>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button size="sm" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
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
            <Label>Aadhaar</Label>
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
            <Label>History</Label>
            <Textarea value={patient.history || ""} onChange={e => setPatient({ ...patient, history: e.target.value })} disabled={!editMode} rows={3} />
          </div>
          <div>
            <Label>Medicines</Label>
            <Input value={patient.medicines || ""} onChange={e => setPatient({ ...patient, medicines: e.target.value })} disabled={!editMode} />
          </div>
          <div>
            <Label>Allergies</Label>
            <Input value={patient.allergies || ""} onChange={e => setPatient({ ...patient, allergies: e.target.value })} disabled={!editMode} />
          </div>
          <div className="md:col-span-2">
            <Label>Permanent Conditions</Label>
            <Textarea value={patient.permanent_conditions || ""} onChange={e => setPatient({ ...patient, permanent_conditions: e.target.value })} disabled={!editMode} rows={3} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
