"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getCertificatesByUser, getEventById } from "@/lib/storage"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import jsPDF from "jspdf"

export default function MyCertificatesPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [certificates, setCertificates] = useState<any[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "public") {
      router.push("/login")
      return
    }
    setCurrentUser(user)

    const certs = getCertificatesByUser(user.id)
    const certsWithEvents = certs.map((c) => ({
      ...c,
      event: getEventById(c.eventId),
    }))
    setCertificates(certsWithEvents)
  }, [router])

  const handleDownload = (cert: any) => {
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // Background
      doc.setFillColor(245, 245, 245)
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20, "F")

      // Border
      doc.setDrawColor(0, 123, 255)
      doc.setLineWidth(2)
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30)

      // Title
      doc.setFontSize(32)
      doc.setTextColor(0, 123, 255)
      doc.text("Certificate of Participation", pageWidth / 2, 50, { align: "center" })

      // Decorative line
      doc.setDrawColor(0, 123, 255)
      doc.setLineWidth(1)
      doc.line(40, 60, pageWidth - 40, 60)

      // Content
      doc.setFontSize(14)
      doc.setTextColor(50, 50, 50)
      doc.text("This is to certify that", pageWidth / 2, 80, { align: "center" })

      doc.setFontSize(20)
      doc.setTextColor(0, 123, 255)
      doc.text(currentUser?.name || "Participant", pageWidth / 2, 100, { align: "center" })

      doc.setFontSize(14)
      doc.setTextColor(50, 50, 50)
      doc.text("has successfully participated in", pageWidth / 2, 120, { align: "center" })

      doc.setFontSize(18)
      doc.setTextColor(0, 123, 255)
      doc.text(cert.event?.title || "Event", pageWidth / 2, 140, { align: "center" })

      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text(`Date: ${new Date(cert.event?.startDate).toLocaleDateString()}`, pageWidth / 2, 160, { align: "center" })

      // Signature line
      doc.setDrawColor(0, 0, 0)
      doc.line(30, 200, 80, 200)
      doc.setFontSize(10)
      doc.text("Organizer Signature", 55, 210, { align: "center" })

      // Save
      doc.save(`certificate-${cert.event?.title}.pdf`)
    } catch (err) {
      console.error("Failed to download certificate")
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-2">My Certificates</h1>
            <p className="text-muted-foreground">Download your earned certificates</p>
          </div>

          {certificates.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <Card key={cert.id} className="hover:shadow-lg transition">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      {cert.event?.title}
                    </CardTitle>
                    <CardDescription>{new Date(cert.generatedAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => handleDownload(cert)} className="w-full gap-2">
                      <Download className="w-4 h-4" />
                      Download Certificate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No certificates yet</p>
              <p className="text-sm text-muted-foreground">Attend events and earn certificates</p>
            </Card>
          )}
        </div>
      </main>
    </>
  )
}
