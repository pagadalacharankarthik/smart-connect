"use client"

import { useState } from "react"
import Link from "next/link"
import { getCurrentUser, logout } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, User } from "lucide-react"
import { AnimatedLogo } from "./animated-logo"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const currentUser = getCurrentUser()

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <AnimatedLogo />
            </div>
            <span className="font-bold text-lg hidden sm:inline">SmartConnect</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {currentUser ? (
              <>
                <Link
                  href={currentUser.role === "organization" ? "/org-dashboard" : "/dashboard"}
                  className="text-sm hover:text-primary transition"
                >
                  Dashboard
                </Link>
                <Link href="/events" className="text-sm hover:text-primary transition">
                  Events
                </Link>
                {currentUser.role === "public" && (
                  <Link href="/my-certificates" className="text-sm hover:text-primary transition">
                    Certificates
                  </Link>
                )}
                {currentUser.role === "organization" && (
                  <Link href="/admin/analytics" className="text-sm hover:text-primary transition">
                    Analytics
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{currentUser.name}</span>
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2 bg-transparent">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {currentUser ? (
              <>
                <Link
                  href={currentUser.role === "organization" ? "/org-dashboard" : "/dashboard"}
                  className="block px-4 py-2 hover:bg-muted rounded"
                >
                  Dashboard
                </Link>
                <Link href="/events" className="block px-4 py-2 hover:bg-muted rounded">
                  Events
                </Link>
                {currentUser.role === "public" && (
                  <Link href="/my-certificates" className="block px-4 py-2 hover:bg-muted rounded">
                    Certificates
                  </Link>
                )}
                {currentUser.role === "organization" && (
                  <Link href="/admin/analytics" className="block px-4 py-2 hover:bg-muted rounded">
                    Analytics
                  </Link>
                )}
                <div className="px-4 py-2 text-sm">{currentUser.name}</div>
                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="block">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
