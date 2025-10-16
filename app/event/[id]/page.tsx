"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getCurrentUser,
  getEventById,
  getParticipantsByEvent,
  addParticipant,
  isUserRegistered,
  addFeedback,
  getFeedbacksByEvent,
  getAverageRating,
  updateParticipant,
  addCertificate,
  getCertificatesByUser,
  getUserById,
} from "@/lib/storage"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Users, Star, Download, AlertCircle } from "lucide-react"
import jsPDF from "jspdf"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [event, setEvent] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [isRegistered, setIsRegistered] = useState(false)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [attended, setAttended] = useState(false)
  const [hasCertificate, setHasCertificate] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }
    setCurrentUser(user)

    const eventData = getEventById(params.id)
    if (!eventData) {
      router.push("/events")
      return
    }

    setEvent(eventData)
    const eventParticipants = getParticipantsByEvent(params.id)
    setParticipants(eventParticipants)

    const registered = isUserRegistered(user.id, params.id)
    setIsRegistered(registered)

    const participant = eventParticipants.find((p) => p.userId === user.id)
    if (participant) {
      setAttended(participant.status === "attended")
    }

    const certs = getCertificatesByUser(user.id)
    setHasCertificate(certs.some((c) => c.eventId === params.id))

    const eventFeedbacks = getFeedbacksByEvent(params.id)
    setFeedbacks(eventFeedbacks)
  }, [params.id, router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isUserRegistered(currentUser?.id || "", params.id)) {
        setError("Already registered for this event")
        setLoading(false)
        return
      }

      addParticipant({
        userId: currentUser?.id || "",
        eventId: params.id,
        status: "registered",
      })

      setIsRegistered(true)
      setShowRegisterForm(false)
      const updatedParticipants = getParticipantsByEvent(params.id)
      setParticipants(updatedParticipants)
    } catch (err) {
      setError("Failed to register. Please try again.")
      setLoading(false)
    }
  }

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      addFeedback({
        eventId: params.id,
        userId: currentUser?.id || "",
        rating,
        comment,
      })

      setComment("")
      setRating(5)
      const updatedFeedbacks = getFeedbacksByEvent(params.id)
      setFeedbacks(updatedFeedbacks)
    } catch (err) {
      setError("Failed to add feedback. Please try again.")
    }
    setLoading(false)
  }

  const handleMarkAttendance = () => {
    const participant = participants.find((p) => p.userId === currentUser?.id)
    if (participant) {
      updateParticipant(participant.id, { status: "attended" })
      setAttended(true)
      const updatedParticipants = getParticipantsByEvent(params.id)
      setParticipants(updatedParticipants)
    }
  }

  const handleGenerateCertificate = () => {
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
      doc.text(event?.title || "Event", pageWidth / 2, 140, { align: "center" })

      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text(`Date: ${new Date(event?.startDate).toLocaleDateString()}`, pageWidth / 2, 160, { align: "center" })

      // Signature line
      doc.setDrawColor(0, 0, 0)
      doc.line(30, 200, 80, 200)
      doc.setFontSize(10)
      doc.text("Organizer Signature", 55, 210, { align: "center" })

      // Save
      doc.save(`certificate-${event?.title}.pdf`)

      // Store certificate
      addCertificate({
        userId: currentUser?.id || "",
        eventId: params.id,
        pdfData: "generated",
      })

      setHasCertificate(true)
    } catch (err) {
      setError("Failed to generate certificate")
    }
  }

  const averageRating = getAverageRating(params.id)
  const organizer = event ? getUserById(event.organizerId) : null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex gap-2 text-sm text-destructive mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {event && (
            <div className="space-y-6">
              {/* Event Header */}
              <Card className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-6xl">📅</div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-3xl">{event.title}</CardTitle>
                      <CardDescription className="mt-2">{event.description}</CardDescription>
                    </div>
                    {isRegistered && (
                      <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium">
                        ✓ Registered
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>

              {/* Event Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Event Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date & Time</p>
                        <p className="font-medium">{new Date(event.startDate).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{event.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Participants</p>
                        <p className="font-medium">{participants.length} registered</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Organizer Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{event.contactInfo.name || organizer?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{event.contactInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{event.contactInfo.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Registration Section */}
              {!isRegistered && (
                <Card>
                  <CardHeader>
                    <CardTitle>Register for Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input value={currentUser?.name} disabled />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input value={currentUser?.email} disabled />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Registering..." : "Register Now"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Attendance & Certificate Section */}
              {isRegistered && currentUser?.role === "organization" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Participants</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {participants.map((p) => {
                          const user = getUserById(p.userId)
                          return (
                            <div key={p.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                              <div>
                                <p className="font-medium">{user?.name}</p>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs px-2 py-1 rounded ${p.status === "attended" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                                >
                                  {p.status === "attended" ? "✓ Attended" : "Registered"}
                                </span>
                                {p.status !== "attended" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      updateParticipant(p.id, { status: "attended" })
                                      const updated = getParticipantsByEvent(params.id)
                                      setParticipants(updated)
                                    }}
                                  >
                                    Mark Attended
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Certificate Section */}
              {isRegistered && attended && currentUser?.role === "public" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Certificate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hasCertificate ? (
                      <Button className="w-full gap-2">
                        <Download className="w-4 h-4" />
                        Download Certificate
                      </Button>
                    ) : (
                      <Button onClick={handleGenerateCertificate} className="w-full gap-2">
                        Generate Certificate
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Feedback Section */}
              {isRegistered && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Feedback & Ratings
                    </CardTitle>
                    <CardDescription>Average Rating: {averageRating.toFixed(1)} / 5</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add Feedback Form */}
                    <form onSubmit={handleAddFeedback} className="space-y-4 pb-6 border-b">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setRating(r)}
                              className={`text-2xl transition ${r <= rating ? "text-yellow-400" : "text-gray-300"}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Comment</label>
                        <textarea
                          placeholder="Share your feedback..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                        />
                      </div>
                      <Button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Feedback"}
                      </Button>
                    </form>

                    {/* Feedbacks List */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Recent Feedback</h3>
                      {feedbacks.length > 0 ? (
                        feedbacks.map((f) => {
                          const user = getUserById(f.userId)
                          return (
                            <div key={f.id} className="p-4 bg-muted rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-medium">{user?.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(f.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < f.rating ? "text-yellow-400" : "text-gray-300"}>
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm">{f.comment}</p>
                            </div>
                          )
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground">No feedback yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
