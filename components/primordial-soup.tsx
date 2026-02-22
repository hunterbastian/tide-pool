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
  type: "debris" | "bubble" | "predator" | "spore"
  wobble: number
  wobbleSpeed: number
  rot: number
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

    const colors = {
      debris: ["#1a3028", "#2a4030", "#1e3828", "#284030"],
      bubble: ["#102820", "#183028", "#122820"],
      predator: ["#302830", "#3a3038", "#282430"],
      spore: ["#2a3020", "#303828", "#283020"],
    }

    const particles: Particle[] = []
    for (let i = 0; i < 70; i++) {
      const type: Particle["type"] =
        i < 30 ? "debris" : i < 45 ? "bubble" : i < 58 ? "spore" : "predator"
      const colorSet = colors[type]
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: type === "predator" ? 4 + Math.random() * 6 : type === "bubble" ? 2 + Math.random() * 5 : 1 + Math.random() * 3,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: type === "bubble" ? -(0.05 + Math.random() * 0.15) : (Math.random() - 0.5) * 0.12,
        opacity: 0.1 + Math.random() * 0.25,
        color: colorSet[Math.floor(Math.random() * colorSet.length)],
        type,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.005 + Math.random() * 0.02,
        rot: Math.random() * Math.PI * 2,
      })
    }
    particlesRef.current = particles

    let time = 0
    const animate = () => {
      time++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.wobble += p.wobbleSpeed
        p.rot += 0.003
        p.x += p.speedX + Math.sin(p.wobble) * 0.2
        p.y += p.speedY + Math.cos(p.wobble) * 0.1

        if (p.x < -20) p.x = canvas.width + 20
        if (p.x > canvas.width + 20) p.x = -20
        if (p.y < -20) p.y = canvas.height + 20
        if (p.y > canvas.height + 20) p.y = -20

        ctx.save()
        ctx.globalAlpha = p.opacity

        if (p.type === "debris") {
          // Irregular organic chunks
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rot)
          ctx.beginPath()
          const segs = 5
          for (let s = 0; s <= segs; s++) {
            const angle = (s / segs) * Math.PI * 2
            const r = p.size * (0.6 + 0.4 * Math.sin(s * 2.1 + time * 0.005))
            const px = Math.cos(angle) * r
            const py = Math.sin(angle) * r
            if (s === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.closePath()
          ctx.fillStyle = p.color
          ctx.fill()
        } else if (p.type === "bubble") {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.strokeStyle = p.color
          ctx.lineWidth = 0.6
          ctx.stroke()
        } else if (p.type === "spore") {
          // Tiny dots, faintly glowing
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()
        } else {
          // Predator — darker amoeba shape, slightly larger
          ctx.beginPath()
          const segs = 7
          for (let s = 0; s <= segs; s++) {
            const angle = (s / segs) * Math.PI * 2
            const r = p.size * (0.7 + 0.3 * Math.sin(time * 0.015 + s * 1.8))
            const px = p.x + Math.cos(angle) * r
            const py = p.y + Math.sin(angle) * r
            if (s === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.closePath()
          ctx.fillStyle = p.color
          ctx.fill()
          // Dim red eye
          ctx.beginPath()
          ctx.arc(p.x + p.size * 0.2, p.y - p.size * 0.1, 1, 0, Math.PI * 2)
          ctx.fillStyle = "#503040"
          ctx.globalAlpha = 0.3 + 0.2 * Math.sin(time * 0.03)
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
