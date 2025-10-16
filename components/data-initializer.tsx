"use client"

import { useEffect } from "react"
import { initializeDummyData } from "@/lib/dummy-data"

export function DataInitializer() {
  useEffect(() => {
    initializeDummyData()
  }, [])

  return null
}
