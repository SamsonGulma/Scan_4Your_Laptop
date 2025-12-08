"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, XCircle, RotateCcw } from "lucide-react"

interface ScanResultProps {
  result: {
    message: string
    user?: {
      name: string
      has_laptop: boolean
      laptop_name: string | null
    }
  } | null
  error?: string | null
  onReset: () => void
}

export default function ScanResult({ result, error, onReset }: ScanResultProps) {
  const getStatus = () => {
    if (error || !result?.user) {
      return {
        type: "error" as const,
        icon: XCircle,
        color: "bg-red-100 text-red-700 border-red-400",
        title: "Not Found",
      }
    }

    if (result.user.has_laptop) {
      return {
        type: "success" as const,
        icon: CheckCircle,
        color: "bg-green-100 text-green-700 border-green-400",
        title: "Has Laptop",
      }
    }

    return {
      type: "warning" as const,
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-700 border-yellow-400",
      title: "No Laptop",
    }
  }

  const status = getStatus()
  const StatusIcon = status.icon

  return (
    <div className="space-y-8 max-w-md mx-auto animate-slide-in">
      <Alert className={`flex items-center gap-3 border-2 rounded-lg px-4 py-3 ${status.color}`}>
        <StatusIcon className="h-6 w-6" />
        <AlertDescription className="font-medium text-base">{error || result?.message}</AlertDescription>
      </Alert>

      {result?.user && (
        <Card className="p-6 shadow-lg space-y-6 rounded-xl border border-muted-foreground/10">
          <div>
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Student Name</p>
            <p className="text-2xl font-bold text-foreground mt-1">{result.user.name}</p>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg border border-muted-foreground/20">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Laptop Status</p>
            {result.user.has_laptop ? (
              <>
                <p className="text-lg text-green-600 font-semibold mt-2 flex items-center gap-1">
                  <CheckCircle className="w-5 h-5" /> Has Laptop
                </p>
                {result.user.laptop_name && (
                  <p className="text-sm text-foreground mt-1">Model: {result.user.laptop_name}</p>
                )}
              </>
            ) : (
              <p className="text-lg text-yellow-700 font-semibold mt-2 flex items-center gap-1">
                <AlertCircle className="w-5 h-5" /> No Laptop Assigned
              </p>
            )}
          </div>
        </Card>
      )}

      <Button
        onClick={onReset}
        className="w-full gap-2 bg-primary text-white hover:bg-primary/90 border border-primary/80"
        size="lg"
      >
        <RotateCcw className="w-5 h-5" />
        Scan Another
      </Button>
    </div>
  )
}
