"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera } from "lucide-react"
import ScannerUI from "@/components/scanner-ui"

export default function ScanPage() {
  const [scanMode, setScanMode] = useState<"manual" | "camera">("manual")

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8">
      <div className="container mx-auto px-4">
        {/* Header with back button */}
        <div className="mb-8 flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto animate-slide-in">
          <h1 className="text-3xl font-bold mb-2 text-center text-foreground">Barcode Scanner</h1>
          <p className="text-center text-muted-foreground mb-8">Scan student barcodes to verify information</p>

          {/* Mode Selector */}
          <div className="flex gap-4 mb-8 justify-center">
            <Button
              variant={scanMode === "manual" ? "default" : "outline"}
              onClick={() => setScanMode("manual")}
              className="gap-2"
            >
              Manual Input
            </Button>
            <Button
              variant={scanMode === "camera" ? "default" : "outline"}
              onClick={() => setScanMode("camera")}
              className="gap-2"
            >
              <Camera className="w-4 h-4" />
              Camera
            </Button>
          </div>

          <ScannerUI mode={scanMode} />
        </div>
      </div>
    </main>
  )
}
