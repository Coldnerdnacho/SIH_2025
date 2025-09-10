"use client"
import { useEffect } from "react"

export default function HomePage() {
  useEffect(() => {
    // Redirect to dashboard by default
    window.location.href = "/dashboard"
  }, [])

  return null
}
