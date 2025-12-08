"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"

interface CameraScannerProps {
  onResult: (result: any) => void
}

export default function CameraScanner({ onResult }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          streamRef.current = stream
        }
        setIsLoading(false)
      } catch (err) {
        setError("Unable to access camera. Please check permissions.")
        setIsLoading(false)
      }
    }

    startCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleCaptureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsScanning(true)
    try {
      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight

      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return

        const formData = new FormData()
        formData.append("barcode_image", blob, "frame.jpg")

        try {
          const response = await fetch("http://localhost:8000/scan/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            onResult({
              message: "Student not found",
              user: null,
            })
            return
          }

          const data = await response.json()
          onResult(data)
        } catch (err) {
          onResult({
            message: err instanceof Error ? err.message : "An error occurred",
            user: null,
          })
        } finally {
          setIsScanning(false)
        }
      }, "image/jpeg")
    } catch (err) {
      setError("Error capturing image")
      setIsScanning(false)
    }
  }

  const handleManualInput = async () => {
    const barcodeId = prompt("Enter barcode ID:")
    if (barcodeId) {
      setIsScanning(true)
      try {
        const requestBody = new URLSearchParams()
        requestBody.append("barcode_input", barcodeId.trim())

        const response = await fetch("http://localhost:8000/scan/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: requestBody.toString(),
        })

        if (!response.ok) {
          onResult("Student not found")
          return
        }

        const data = await response.json()
        onResult(data)
      } catch (err) {
        onResult(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsScanning(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && !error && (
        <Card className="p-8 flex flex-col items-center justify-center h-80 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Initializing camera...</p>
        </Card>
      )}

      {!isLoading && !error && (
        <>
          <Card className="p-4 overflow-hidden shadow-lg border-2 border-primary">
            <video ref={videoRef} autoPlay playsInline className="w-full h-80 object-cover rounded-lg bg-black" />
          </Card>

          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">Position barcode in the camera frame</p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleCaptureAndScan}
                disabled={isScanning}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  "Capture & Scan"
                )}
              </Button>
              <Button
                onClick={handleManualInput}
                disabled={isScanning}
                variant="outline"
                className="gap-2 bg-transparent"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Manual Input"
                )}
              </Button>
            </div>
          </div>

          {/* Hidden canvas for capturing frames */}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </>
      )}
    </div>
  )
}
