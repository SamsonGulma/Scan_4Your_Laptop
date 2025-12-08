"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertCircle } from "lucide-react"
import RegistrationForm from "@/components/registration-form"
import SuccessDisplay from "@/components/success-display"

interface RegistrationData {
  id: string
  name: string
  has_laptop: boolean
  laptop_name: string | null
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [successData, setSuccessData] = useState<RegistrationData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: { name: string; has_laptop: boolean; laptop_name: string }) => {
  setIsLoading(true)
  setError(null)

  try {
    const requestBody = new URLSearchParams()
    requestBody.append("name", formData.name)
    requestBody.append("has_laptop", String(formData.has_laptop))
    requestBody.append("laptop_name", formData.laptop_name || "")

    const response = await fetch("http://127.0.0.1:8000/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestBody.toString(),
    })

    if (!response.ok) {
      throw new Error("Registration failed")
    }

    const data = await response.json()

    setSuccessData({
      id: data.id || data.student_id,
      name: data.name,
      has_laptop: data.has_laptop,
      laptop_name: data.laptop_name || null,
    })
  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred during registration")
  } finally {
    setIsLoading(false)
  }
}

  const handleReset = () => {
    setSuccessData(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-xl mx-auto animate-slide-in">
          {successData ? (
            <>
              <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Registration Complete</h1>
              <SuccessDisplay studentData={successData} onReset={handleReset} />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Register Student</h1>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Card className="p-8 shadow-lg">
                <RegistrationForm onSubmit={handleSubmit} isLoading={isLoading} />
              </Card>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
