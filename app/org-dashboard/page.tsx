"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getEvents, getParticipantsByEvent } from "@/lib/storage"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Calendar, Users, Plus } from "lucide-react"
import Link from "next/link"

export default function OrgDashboardPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [stats, setStats] = useState({ events: 0, participants: 0, attended: 0 })
  const [orgEvents, setOrgEvents] = useState<any[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "organization") {
      router.push("/login")
      return
    }
    setCurrentUser(user)

    const allEvents = getEvents().filter((e) => e.organizerId === user.id)
    setOrgEvents(allEvents)

    let totalParticipants = 0
    let totalAttended = 0

    allEvents.forEach((event) => {
      const participants = getParticipantsByEvent(event.id)
      totalParticipants += participants.length
      totalAttended += participants.filter((p) => p.status === "attended").length
    })

    setStats({
      events: allEvents.length,
      participants: totalParticipants,
      attended: totalAttended,
    })
  }, [router])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser?.name}!</h1>
              <p className="text-muted-foreground">Manage your events and track participation</p>
            </div>
            <Link href="/create-event">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Event
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Events Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.events}</div>
                <p className="text-xs text-muted-foreground mt-1">Total events</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.participants}</div>
                <p className="text-xs text-muted-foreground mt-1">Registrations</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Attended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.attended}</div>
                <p className="text-xs text-muted-foreground mt-1">Confirmed attendance</p>
              </CardContent>
            </Card>
          </div>

          {/* Events List */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Events</h2>
            {orgEvents.length > 0 ? (
              <div className="space-y-4">
                {orgEvents.map((event) => {
                  const participants = getParticipantsByEvent(event.id)
                  const attended = participants.filter((p) => p.status === "attended").length

                  return (
                    <Card key={event.id} className="hover:shadow-lg transition">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>{event.description}</CardDescription>
                          </div>
                          <Link href={`/event/${event.id}`}>
                            <Button size="sm">Manage</Button>
                          </Link>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(event.startDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            {participants.length} registered
                          </div>
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-muted-foreground" />
                            {attended} attended
                          </div>
                          <div className="text-muted-foreground">
                            {event.eventType === "online" ? "🌐 Online" : "📍 Offline"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No events created yet</p>
                <Link href="/create-event">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Your First Event
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
