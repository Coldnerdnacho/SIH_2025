export interface Patient {
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

export const savePatient = (patient: Patient): void => {
  const existingPatients = getPatients()
  const patientIndex = existingPatients.findIndex((p) => p.id === patient.id)

  if (patientIndex >= 0) {
    // Update existing patient
    existingPatients[patientIndex] = patient
  } else {
    // Add new patient
    existingPatients.push(patient)
  }

  localStorage.setItem("hospital-patients", JSON.stringify(existingPatients))
}

export const getPatients = (): Patient[] => {
  if (typeof window === "undefined") return []

  const savedPatients = localStorage.getItem("hospital-patients")
  return savedPatients ? JSON.parse(savedPatients) : []
}

export const getPatientById = (id: string): Patient | null => {
  const patients = getPatients()
  return patients.find((patient) => patient.id === id) || null
}

export const deletePatient = (id: string): void => {
  const patients = getPatients()
  const updatedPatients = patients.filter((patient) => patient.id !== id)
  localStorage.setItem("hospital-patients", JSON.stringify(updatedPatients))
}

export const generateUniqueId = (aadhaar: string): string => {
  // Reverse the Aadhaar number to create unique ID
  return aadhaar.split("").reverse().join("")
}

export const validateAadhaar = (aadhaar: string): boolean => {
  // Check if Aadhaar is exactly 12 digits
  return /^\d{12}$/.test(aadhaar)
}
