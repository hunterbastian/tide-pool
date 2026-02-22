"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
  type: "nutrient" | "bubble" | "microbe"
  wobble: number
  wobbleSpeed: number
}

export function PrimordialSoup() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Seed particles
    const colors = {
      nutrient: ["#3ecf5c", "#40e070", "#80ff90"],
      bubble: ["#2060a0", "#3080c0", "#4090d0"],
      microbe: ["#e06030", "#d04040", "#c07040"],
    }

    const particles: Particle[] = []
    for (let i = 0; i < 60; i++) {
      const type: Particle["type"] =
        i < 30 ? "nutrient" : i < 48 ? "bubble" : "microbe"
      const colorSet = colors[type]
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: type === "bubble" ? 2 + Math.random() * 6 : type === "microbe" ? 3 + Math.random() * 4 : 1.5 + Math.random() * 3,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: type === "bubble" ? -(0.1 + Math.random() * 0.3) : (Math.random() - 0.5) * 0.2,
        opacity: 0.15 + Math.random() * 0.35,
        color: colorSet[Math.floor(Math.random() * colorSet.length)],
        type,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.03,
      })
    }
    particlesRef.current = particles

    let time = 0
    const animate = () => {
      time++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.wobble += p.wobbleSpeed
        p.x += p.speedX + Math.sin(p.wobble) * 0.3
        p.y += p.speedY + Math.cos(p.wobble) * 0.15

        // Wrap around
        if (p.x < -20) p.x = canvas.width + 20
        if (p.x > canvas.width + 20) p.x = -20
        if (p.y < -20) p.y = canvas.height + 20
        if (p.y > canvas.height + 20) p.y = -20

        ctx.save()
        ctx.globalAlpha = p.opacity

        if (p.type === "nutrient") {
          // Small glowing dots
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()
          ctx.shadowBlur = 8
          ctx.shadowColor = p.color
          ctx.fill()
        } else if (p.type === "bubble") {
          // Hollow circles
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.strokeStyle = p.color
          ctx.lineWidth = 0.8
          ctx.stroke()
          // Highlight
          ctx.beginPath()
          ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.25, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(255,255,255,0.3)"
          ctx.fill()
        } else {
          // Microbe — little amoeba shapes
          ctx.beginPath()
          const segs = 6
          for (let s = 0; s <= segs; s++) {
            const angle = (s / segs) * Math.PI * 2
            const r = p.size * (0.8 + 0.2 * Math.sin(time * 0.03 + s * 1.5))
            const px = p.x + Math.cos(angle) * r
            const py = p.y + Math.sin(angle) * r
            if (s === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.closePath()
          ctx.fillStyle = p.color
          ctx.fill()
        }

        ctx.restore()
      }

      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
