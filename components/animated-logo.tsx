"use client"

import { useEffect, useRef } from "react"

export function AnimatedLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let angle = 0

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set up canvas
      ctx.fillStyle = "#007bff"
      ctx.strokeStyle = "#007bff"
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      // Left hand
      ctx.save()
      ctx.translate(8, 16)
      ctx.rotate(-Math.sin(angle) * 0.3)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-4, -2)
      ctx.lineTo(-6, -1)
      ctx.stroke()
      ctx.restore()

      // Right hand
      ctx.save()
      ctx.translate(24, 16)
      ctx.rotate(Math.sin(angle) * 0.3)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(4, -2)
      ctx.lineTo(6, -1)
      ctx.stroke()
      ctx.restore()

      // Connection point (handshake)
      ctx.beginPath()
      ctx.arc(16, 16, 3, 0, Math.PI * 2)
      ctx.fill()

      angle += 0.1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return <canvas ref={canvasRef} width={32} height={32} className="w-8 h-8" />
}
