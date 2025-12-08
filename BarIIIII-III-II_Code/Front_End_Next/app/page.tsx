import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Barcode, UserPlus } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
              <Barcode className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Student Registration System</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Efficient admin dashboard for student registration and barcode scanning
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Register Card */}
          <Card className="p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-foreground">Register Student</h2>
            <p className="text-muted-foreground mb-6">Add new students to the system with laptop information</p>
            <Link href="/register" className="w-full">
              <Button className="w-full" size="lg">
                Go to Registration
              </Button>
            </Link>
          </Card>

          {/* Scan Card */}
          <Card className="p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <Barcode className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-foreground">Scan Barcode</h2>
            <p className="text-muted-foreground mb-6">Quickly check student information by scanning their barcode</p>
            <Link href="/scan" className="w-full">
              <Button variant="secondary" className="w-full" size="lg">
                Go to Scanner
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </main>
  )
}
