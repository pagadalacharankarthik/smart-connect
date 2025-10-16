"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, updateUser, getParticipantsByUser } from "@/lib/storage"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    age: "",
    organizationType: "",
    contactPerson: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ events: 0, badges: 0 })

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }
    setCurrentUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile || "",
      age: user.age?.toString() || "",
      organizationType: user.organizationType || "",
      contactPerson: user.contactPerson || "",
    })

    if (user.role === "public") {
      const participants = getParticipantsByUser(user.id)
      const attendedCount = participants.filter((p) => p.status === "attended").length
      let badge = 0
      if (attendedCount >= 6) badge = 3
      else if (attendedCount >= 3) badge = 2
      else if (attendedCount >= 1) badge = 1

      setStats({
        events: participants.length,
        badges: badge,
      })
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (!formData.name || !formData.email) {
        setError("Please fill in required fields")
        setLoading(false)
        return
      }

      const updated = updateUser(currentUser?.id || "", {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        age: currentUser?.role === "public" ? Number.parseInt(formData.age) : undefined,
        organizationType: currentUser?.role === "organization" ? formData.organizationType : undefined,
        contactPerson: currentUser?.role === "organization" ? formData.contactPerson : undefined,
      })

      if (updated) {
        setCurrentUser(updated)
        localStorage.setItem("currentUser", JSON.stringify(updated))
        setSuccess("Profile updated successfully!")
      }
    } catch (err) {
      setError("Failed to update profile")
    }
    setLoading(false)
  }

  const badgeNames = ["", "Bronze", "Silver", "Gold"]
  const badgeColors = ["", "bg-amber-600", "bg-slate-400", "bg-yellow-500"]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background to-primary/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">My Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              {/* Stats for Public Users */}
              {currentUser?.role === "public" && (
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Events Joined</p>
                    <p className="text-2xl font-bold">{stats.events}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Badge</p>
                    <div className="flex items-center gap-2 mt-1">
                      {stats.badges > 0 && (
                        <div
                          className={`w-6 h-6 rounded-full ${badgeColors[stats.badges]} flex items-center justify-center text-white text-xs font-bold`}
                        >
                          {badgeNames[stats.badges][0]}
                        </div>
                      )}
                      <span className="font-semibold">{badgeNames[stats.badges] || "None"}</span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {currentUser?.role === "public" ? "Full Name" : "Organization Name"} *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                {currentUser?.role === "public" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mobile</label>
                      <Input
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Age</label>
                      <Input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {currentUser?.role === "organization" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Organization Type</label>
                      <Input
                        value={formData.organizationType}
                        onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Contact Person</label>
                      <Input
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
