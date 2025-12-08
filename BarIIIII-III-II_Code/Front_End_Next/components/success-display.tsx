"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"

interface SuccessDisplayProps {
  studentData: {
    id: string
    name: string
    has_laptop: boolean
    laptop_name: string | null
  }
  onReset: () => void
}

export default function SuccessDisplay({ studentData, onReset }: SuccessDisplayProps) {
  const [barcodeUrl, setBarcodeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch barcode image
    setBarcodeUrl(`http://127.0.0.1:8000/static/barcode/${studentData.id}.png.png`)
    setIsLoading(false)
  }, [studentData.id])

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      <Alert className="border-accent bg-accent/5 text-green-400 border-2 items-center-safe">
        <CheckCircle  className=" w-50 h-50" />
        <AlertDescription className="text-green-400 ml-2 font-light text-lg">
          Student Registered Successfully!
        </AlertDescription>
      </Alert>

      {/* Student Information Card */}
      <Card className="p-8 shadow-lg space-y-6">
        {/* Name */}
        <div>
          <p className="text-lg text-muted-black font-bold uppercase tracking-wide">Student Name</p>
          <p className="text-2xl font-light underline text-foreground mt-1">{studentData.name}</p>
        </div>

        {/* Laptop Info */}
        {studentData.has_laptop && (
          <div>
            <p className="text-lg text-muted-black font-bold uppercase tracking-wide">Laptop</p>
            <p className="text-md text-foreground mt-1 font-medium">{studentData.laptop_name}</p>
          </div>
        )}

        {!studentData.has_laptop && (
          <div>
            <p className="text-lg text-muted-black font-bold uppercase tracking-wide">Laptop Status</p>
            <p className="text-md  text-muted-foreground mt-1">No laptop assigned</p>
          </div>
        )}

        {/* Barcode */}
        <div>
          <p className="text-md text-muted-black font-bold uppercase tracking-wide mb-4">Student Barcode</p>
          {isLoading ? (
            <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg border border-border flex justify-center">
              <Image
                src={barcodeUrl || "/placeholder.svg"}
                alt={`Barcode for ${studentData.name}`}
                width={100}
                height={100}
                unoptimized
                className="max-h-40"
              />
            </div>
          )}
        </div>

        {/* Student ID */}
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">Student ID</p>
          <p className="text-sm font-mono font-semibold text-foreground">{studentData.id}</p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={onReset} variant="outline" className="gap-2 bg-transparent">
          Register Another
        </Button>
        <Link href="/" className="contents">
          <Button className="gap-2">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
