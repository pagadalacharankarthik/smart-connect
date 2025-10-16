"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getParticipantsByUser, getEventById, getCertificatesByUser } from "@/lib/storage"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Calendar, FileText, Zap } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [stats, setStats] = useState({ events: 0, certificates: 0, badges: 0 })
  const [recentEvents, setRecentEvents] = useState<any[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "public") {
      router.push("/login")
      return
    }
    setCurrentUser(user)

    // Calculate stats
    const participants = getParticipantsByUser(user.id)
    const certificates = getCertificatesByUser(user.id)
    const attendedCount = participants.filter((p) => p.status === "attended").length

    let badge = 0
    if (attendedCount >= 6)
      badge = 3 // Gold
    else if (attendedCount >= 3)
      badge = 2 // Silver
    else if (attendedCount >= 1) badge = 1 // Bronze

    setStats({
      events: participants.length,
      certificates: certificates.length,
      badges: badge,
    })

    // Get recent events
    const events = participants
      .slice(-3)
      .map((p) => getEventById(p.eventId))
      .filter(Boolean)
    setRecentEvents(events)
  }, [router])

  const badgeNames = ["", "Bronze", "Silver", "Gold"]
  const badgeColors = ["", "bg-amber-600", "bg-slate-400", "bg-yellow-500"]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser?.name}!</h1>
            <p className="text-muted-foreground">Track your events, certificates, and achievements</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Events Joined</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.events}</div>
                <p className="text-xs text-muted-foreground mt-1">Total registrations</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.certificates}</div>
                <p className="text-xs text-muted-foreground mt-1">Earned certificates</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Badge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {stats.badges > 0 && (
                    <div
                      className={`w-8 h-8 rounded-full ${badgeColors[stats.badges]} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {badgeNames[stats.badges][0]}
                    </div>
                  )}
                  <span className="text-lg font-semibold">{badgeNames[stats.badges] || "None"}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Volunteer badge</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/profile">
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Events */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Events</h2>
              {recentEvents.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {recentEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.startDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Zap className="w-4 h-4" />
                            {event.category}
                          </div>
                        </div>
                        <Link href={`/event/${event.id}`}>
                          <Button size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">No events joined yet</p>
                  <Link href="/events">
                    <Button>Browse Events</Button>
                  </Link>
                </Card>
              )}
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/events">
                <Card className="hover:shadow-lg transition cursor-pointer h-full">
                  <CardHeader>
                    <Calendar className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>Browse Events</CardTitle>
                    <CardDescription>Discover and join new events</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/my-certificates">
                <Card className="hover:shadow-lg transition cursor-pointer h-full">
                  <CardHeader>
                    <FileText className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>My Certificates</CardTitle>
                    <CardDescription>View and download certificates</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/profile">
                <Card className="hover:shadow-lg transition cursor-pointer h-full">
                  <CardHeader>
                    <Award className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>Manage your account</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
