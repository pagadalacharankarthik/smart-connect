"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/storage"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Zap, Users, Award, BarChart3 } from "lucide-react"
import { initializeDummyData } from "@/lib/dummy-data"

export default function Home() {
  const router = useRouter()
  const currentUser = getCurrentUser()

  useEffect(() => {
    initializeDummyData()

    if (currentUser) {
      router.push(currentUser.role === "organization" ? "/org-dashboard" : "/dashboard")
    }
  }, [currentUser, router])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
                Connect, Create & Manage Community Events
              </h1>
              <p className="text-lg text-muted-foreground text-balance">
                SmartConnect is your all-in-one platform for organizing events, managing registrations, tracking
                attendance, and building community engagement with certificates and gamification.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🎯</div>
                  <p className="text-sm text-muted-foreground">Event Management Made Simple</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Easy Event Creation", desc: "Create and manage events in minutes" },
              { icon: Users, title: "Smart Registration", desc: "Seamless registration and tracking" },
              { icon: Award, title: "Auto Certificates", desc: "Generate PDF certificates instantly" },
              { icon: BarChart3, title: "Real-time Insights", desc: "Track attendance and analytics" },
            ].map((feature, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition">
                <feature.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg opacity-90">Join thousands of organizers managing events with SmartConnect</p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Create Your Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
