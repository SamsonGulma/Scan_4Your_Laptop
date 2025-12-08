"use client"

import { useState } from "react"
import ManualScanner from "./manual-scanner"
import CameraScanner from "./camera-scanner"
import ScanResultComponent from "./scan-result"

interface ScanResult {
  message: string
  user: {
    name: string
    has_laptop: boolean
    laptop_name: string | null
  }
}

export interface ScannerUIProps {
  mode: "manual" | "camera"
}

export default function ScannerUI({ mode }: ScannerUIProps) {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScanResult = (scanResult: ScanResult | string) => {
    if (typeof scanResult === "string") {
      setError(scanResult)
      setResult(null)
    } else {
      setResult(scanResult)
      setError(null)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  if (result || error) {
    return <ScanResultComponent result={result} error={error} onReset={handleReset} />
  }

  return (
    <div>
      {mode === "manual" ? (
        <ManualScanner onResult={handleScanResult} />
      ) : (
        <CameraScanner onResult={handleScanResult} />
      )}
    </div>
  )
}
