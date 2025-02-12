"use client"

import { useState } from "react"
import OnboardingForm from "../components/OnboardingForm"
import DocumentUpload from "../components/DocumentUpload"
import StatusIndicator from "../components/StatusIndicator"

export default function Home() {
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState(null)
  const [clientId, setClientId] = useState(null)
  const [status, setStatus] = useState("")

  const handleFormSubmit = async (data) => {
    setUserData(data)
    setStatus("Creating client...")
    try {
      const response = await fetch("/api/create-client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.clientId) {
        setClientId(result.clientId)
        setStep(2)
        setStatus("Client created. Please proceed with document verification.")
      } else {
        setStatus("Failed to create client. Please try again.")
      }
    } catch (error) {
      setStatus("An error occurred. Please try again.")
    }
  }

  const handleDocumentUpload = async (checkId) => {
    setStatus("Verifying document and identity...")
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, clientId, checkId }),
      })
      const result = await response.json()
      setStatus(result.status)
      setStep(3)
    } catch (error) {
      setStatus("Verification failed. Please try again.")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Customer Onboarding</h1>
      {step === 1 && <OnboardingForm onSubmit={handleFormSubmit} />}
      {step === 2 && <DocumentUpload clientId={clientId} onUploadComplete={handleDocumentUpload} />}
      {step === 3 && <div className="text-xl font-semibold">Verification Complete</div>}
      <StatusIndicator status={status} />
    </main>
  )
}

