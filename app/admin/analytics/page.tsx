"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getCurrentUser,
  getEvents,
  getUsers,
  getParticipantsByEvent,
  getFeedbacksByEvent,
  getAverageRating,
} from "@/lib/storage"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Users, Calendar, Star, TrendingUp } from "lucide-react"

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalParticipants: 0,
    averageRating: 0,
  })
  const [eventData, setEventData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "organization") {
      router.push("/login")
      return
    }
    setCurrentUser(user)

    // Get all data
    const allUsers = getUsers()
    const allEvents = getEvents().filter((e) => e.organizerId === user.id)

    let totalParticipants = 0
    let totalRating = 0
    let ratingCount = 0

    const eventChartData = allEvents.map((event) => {
      const participants = getParticipantsByEvent(event.id)
      const attended = participants.filter((p) => p.status === "attended").length
      const feedbacks = getFeedbacksByEvent(event.id)
      const avgRating = getAverageRating(event.id)

      totalParticipants += participants.length
      if (feedbacks.length > 0) {
        totalRating += avgRating * feedbacks.length
        ratingCount += feedbacks.length
      }

      return {
        name: event.title.substring(0, 15),
        participants: participants.length,
        attended,
        rating: avgRating,
      }
    })

    // Category breakdown
    const categoryBreakdown: { [key: string]: number } = {}
    allEvents.forEach((event) => {
      categoryBreakdown[event.category] = (categoryBreakdown[event.category] || 0) + 1
    })

    const categoryChartData = Object.entries(categoryBreakdown).map(([name, value]) => ({
      name,
      value,
    }))

    setStats({
      totalUsers: allUsers.length,
      totalEvents: allEvents.length,
      totalParticipants,
      averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
    })

    setEventData(eventChartData)
    setCategoryData(categoryChartData)
  }, [router])

  const COLORS = ["#0066ff", "#00d4ff", "#ffa500", "#ff6b6b", "#4ecdc4", "#45b7d1"]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your events and engagement metrics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">Platform users</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Events Created
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground mt-1">Your events</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Total Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalParticipants}</div>
                <p className="text-xs text-muted-foreground mt-1">Registrations</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Avg Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground mt-1">Out of 5</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {/* Event Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Event Performance</CardTitle>
                <CardDescription>Participants and attendance by event</CardDescription>
              </CardHeader>
              <CardContent>
                {eventData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={eventData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="participants" fill="#0066ff" name="Registered" />
                      <Bar dataKey="attended" fill="#00d4ff" name="Attended" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    No event data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Event Categories</CardTitle>
                <CardDescription>Distribution of events by category</CardDescription>
              </CardHeader>
              <CardContent>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    No category data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Rating Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Event Ratings</CardTitle>
              <CardDescription>Average rating for each event</CardDescription>
            </CardHeader>
            <CardContent>
              {eventData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={eventData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rating" stroke="#ffa500" name="Average Rating" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  No rating data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
