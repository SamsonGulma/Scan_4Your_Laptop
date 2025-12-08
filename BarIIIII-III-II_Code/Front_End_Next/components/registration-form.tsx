"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface RegistrationFormProps {
  onSubmit: (data: { name: string; has_laptop: boolean; laptop_name: string }) => Promise<void>
  isLoading: boolean
}

export default function RegistrationForm({ onSubmit, isLoading }: RegistrationFormProps) {
  const [name, setName] = useState("")
  const [hasLaptop, setHasLaptop] = useState(false)
  const [laptopName, setLaptopName] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Full name is required"
    }

    if (hasLaptop && !laptopName.trim()) {
      newErrors.laptopName = 'Laptop name is required when "Has Laptop" is enabled'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    await onSubmit({
      name: name.trim(),
      has_laptop: hasLaptop,
      laptop_name: hasLaptop ? laptopName.trim() : "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <Label htmlFor="name" className="text-sm font-medium text-foreground">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter student's full name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (errors.name) {
              setErrors({ ...errors, name: "" })
            }
          }}
          disabled={isLoading}
          className="mt-2"
        />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
      </div>

      {/* Has Laptop Toggle */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={hasLaptop}
              onChange={(e) => setHasLaptop(e.target.checked)}
              disabled={isLoading}
              className="w-5 h-5 rounded border border-input bg-background text-primary accent-primary cursor-pointer"
            />
            <span className="ml-3 text-sm font-medium text-foreground">Student has a laptop</span>
          </label>
        </div>
      </div>

      {/* Laptop Name */}
      {hasLaptop && (
        <div>
          <Label htmlFor="laptop_name" className="text-sm font-medium text-foreground">
            Laptop Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="laptop_name"
            type="text"
            placeholder="e.g., Dell XPS, MacBook Pro"
            value={laptopName}
            onChange={(e) => {
              setLaptopName(e.target.value)
              if (errors.laptopName) {
                setErrors({ ...errors, laptopName: "" })
              }
            }}
            disabled={isLoading}
            className="mt-2"
          />
          {errors.laptopName && <p className="text-sm text-destructive mt-1">{errors.laptopName}</p>}
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading} className="w-full gap-2" size="lg">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Registering...
          </>
        ) : (
          "Register Student"
        )}
      </Button>
    </form>
  )
}
