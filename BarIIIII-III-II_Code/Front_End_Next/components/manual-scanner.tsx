"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Loader2, Search, Upload } from "lucide-react"

interface ManualScannerProps {
  onResult: (result: string) => void
}

export default function ManualScanner({ onResult }: ManualScannerProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedImage(file)
  }

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedImage) {
      onResult("Please select a barcode image")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("barcode_image", selectedImage)

      const response = await fetch("http://127.0.0.1:8000/scan/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        onResult(data.message || "Student not found")
        return
      }

      onResult(data.message || "Scan successful")
      setSelectedImage(null)
    } catch (err) {
      onResult(err instanceof Error ? err.message : "An error occurred while scanning")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-8 shadow-lg max-w-md mx-auto">
      <form onSubmit={handleScan} className="space-y-6">
        <div>
          <Label htmlFor="barcode-image" className="text-sm font-medium text-foreground">
            Upload Barcode Image <span className="text-destructive">*</span>
          </Label>
          <div className="mt-2 relative">
            <input
              id="barcode-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Upload barcode image"
            />
            <label
              htmlFor="barcode-image"
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {selectedImage ? selectedImage.name : "Click to upload image"}
              </span>
            </label>
          </div>
        </div>

        <Button type="submit" disabled={isLoading || !selectedImage} className="w-full gap-2" size="lg">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Scan Student
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}
