"use client"

import { useEffect, useRef, useCallback } from "react"
import type { Biome, CellStats, ArenaEvent } from "@/lib/game-state"
import { rollArenaFood, rollArenaFight, rollArenaLoot } from "@/lib/game-state"

interface ArenaViewProps {
  biome: Biome
  stats: CellStats
  colorHex: string
  isActive: boolean
  onArenaEvent: (event: ArenaEvent) => void
}

// ── Entity types ─────────────────────────────────────────────
interface Vec2 { x: number; y: number }

interface ArenaEntity {
  id: number
  type: "food" | "enemy" | "loot"
  pos: Vec2
  vel: Vec2
  radius: number
  color: string
  pulsePhase: number
  alive: boolean
}

interface Particle {
  pos: Vec2
  vel: Vec2
  life: number
  maxLife: number
  color: string
  radius: number
}

interface FloatingText {
  pos: Vec2
  text: string
  color: string
  life: number
  maxLife: number
}

const ARENA_W = 480
const ARENA_H = 320

export function ArenaView({ biome, stats, colorHex, isActive, onArenaEvent }: ArenaViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    player: { x: ARENA_W / 2, y: ARENA_H / 2 } as Vec2,
    playerVel: { x: 0.8, y: 0.5 } as Vec2,
    playerAngle: 0,
    entities: [] as ArenaEntity[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    debris: [] as { pos: Vec2; vel: Vec2; size: number; opacity: number }[],
    nextSpawn: 0,
    entityId: 0,
    frame: 0,
  })
  const onArenaEventRef = useRef(onArenaEvent)
  onArenaEventRef.current = onArenaEvent

  const statsRef = useRef(stats)
  statsRef.current = stats

  const biomeRef = useRef(biome)
  biomeRef.current = biome

  // Init debris
  useEffect(() => {
    const s = stateRef.current
    s.debris = Array.from({ length: 25 }, () => ({
      pos: { x: Math.random() * ARENA_W, y: Math.random() * ARENA_H },
      vel: { x: (Math.random() - 0.5) * 0.15, y: (Math.random() - 0.5) * 0.15 },
      size: 1 + Math.random() * 2.5,
      opacity: 0.1 + Math.random() * 0.2,
    }))
  }, [])

  const spawnEntity = useCallback(() => {
    const s = stateRef.current
    const roll = Math.random()
    let type: ArenaEntity["type"]
    if (roll < 0.5) type = "food"
    else if (roll < 0.82) type = "enemy"
    else type = "loot"

    // Spawn on a random edge
    const edge = Math.floor(Math.random() * 4)
    let x = 0, y = 0
    if (edge === 0) { x = Math.random() * ARENA_W; y = -15 }
    else if (edge === 1) { x = ARENA_W + 15; y = Math.random() * ARENA_H }
    else if (edge === 2) { x = Math.random() * ARENA_W; y = ARENA_H + 15 }
    else { x = -15; y = Math.random() * ARENA_H }

    const colors = {
      food: "#60b860",
      enemy: "#cc6060",
      loot: "#d4a050",
    }

    s.entities.push({
      id: s.entityId++,
      type,
      pos: { x, y },
      vel: {
        x: (ARENA_W / 2 - x + (Math.random() - 0.5) * 100) * 0.005,
        y: (ARENA_H / 2 - y + (Math.random() - 0.5) * 100) * 0.005,
      },
      radius: type === "food" ? 6 : type === "enemy" ? 10 : 7,
      color: colors[type],
      pulsePhase: Math.random() * Math.PI * 2,
      alive: true,
    })
  }, [])

  const spawnParticles = useCallback((pos: Vec2, color: string, count: number) => {
    const s = stateRef.current
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.5 + Math.random() * 2
      s.particles.push({
        pos: { x: pos.x, y: pos.y },
        vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        life: 30 + Math.random() * 20,
        maxLife: 50,
        color,
        radius: 1 + Math.random() * 2,
      })
    }
  }, [])

  const spawnText = useCallback((pos: Vec2, text: string, color: string) => {
    stateRef.current.floatingTexts.push({
      pos: { x: pos.x, y: pos.y },
      text,
      color,
      life: 60,
      maxLife: 60,
    })
  }, [])

  // Main loop
  useEffect(() => {
    if (!isActive) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf: number

    const loop = () => {
      const s = stateRef.current
      s.frame++

      // -- Update player (wandering AI) --
      if (s.frame % 60 === 0 || Math.abs(s.playerVel.x) + Math.abs(s.playerVel.y) < 0.3) {
        const speed = 0.6 + statsRef.current.motility * 0.04
        const angle = Math.random() * Math.PI * 2
        s.playerVel.x += Math.cos(angle) * speed * 0.3
        s.playerVel.y += Math.sin(angle) * speed * 0.3
      }

      // Steer toward nearest food/loot, away from strong enemies
      for (const e of s.entities) {
        if (!e.alive) continue
        const dx = e.pos.x - s.player.x
        const dy = e.pos.y - s.player.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = e.type === "enemy" ? -0.02 : 0.03
          s.playerVel.x += (dx / dist) * force
          s.playerVel.y += (dy / dist) * force
        }
      }

      // Clamp speed
      const maxSpeed = 1.2 + statsRef.current.motility * 0.06
      const currentSpeed = Math.sqrt(s.playerVel.x ** 2 + s.playerVel.y ** 2)
      if (currentSpeed > maxSpeed) {
        s.playerVel.x *= maxSpeed / currentSpeed
        s.playerVel.y *= maxSpeed / currentSpeed
      }

      s.player.x += s.playerVel.x
      s.player.y += s.playerVel.y
      s.playerAngle = Math.atan2(s.playerVel.y, s.playerVel.x)

      // Bounce off walls
      const margin = 18
      if (s.player.x < margin) { s.player.x = margin; s.playerVel.x *= -0.7 }
      if (s.player.x > ARENA_W - margin) { s.player.x = ARENA_W - margin; s.playerVel.x *= -0.7 }
      if (s.player.y < margin) { s.player.y = margin; s.playerVel.y *= -0.7 }
      if (s.player.y > ARENA_H - margin) { s.player.y = ARENA_H - margin; s.playerVel.y *= -0.7 }

      // Friction
      s.playerVel.x *= 0.995
      s.playerVel.y *= 0.995

      // -- Spawn entities --
      s.nextSpawn--
      if (s.nextSpawn <= 0) {
        spawnEntity()
        s.nextSpawn = 50 + Math.floor(Math.random() * 80)
      }

      // -- Update entities --
      for (const e of s.entities) {
        if (!e.alive) continue
        e.pos.x += e.vel.x
        e.pos.y += e.vel.y
        e.pulsePhase += 0.05

        // Bounce off walls gently
        if (e.pos.x < 5 || e.pos.x > ARENA_W - 5) e.vel.x *= -1
        if (e.pos.y < 5 || e.pos.y > ARENA_H - 5) e.vel.y *= -1

        // Collision with player
        const dx = e.pos.x - s.player.x
        const dy = e.pos.y - s.player.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const collisionDist = e.radius + 14 // player radius ~14

        if (dist < collisionDist) {
          e.alive = false

          if (e.type === "food") {
            const event = rollArenaFood(biomeRef.current)
            spawnParticles(e.pos, "#60b860", 6)
            spawnText(e.pos, `+${event.nutrients ?? 0}`, "#50bb60")
            onArenaEventRef.current(event)
          } else if (e.type === "enemy") {
            const event = rollArenaFight(statsRef.current, biomeRef.current)
            spawnParticles(e.pos, event.type === "killed_enemy" ? "#cc6060" : "#9868a8", 10)
            spawnText(e.pos, event.type === "killed_enemy" ? `+${event.nutrients ?? 0}` : "FLED", event.type === "killed_enemy" ? "#d4a050" : "#cc6060")
            onArenaEventRef.current(event)
          } else {
            const { event } = rollArenaLoot(biomeRef.current)
            spawnParticles(e.pos, "#d4a050", 8)
            const label = event.fragments ? "+FRAG" : event.statBoost ? `+1 ${event.statBoost.stat.slice(0, 3).toUpperCase()}` : event.biomass ? `+${event.biomass} BM` : event.nutrients ? `+${event.nutrients}` : "BUFF"
            spawnText(e.pos, label, "#d4a050")
            onArenaEventRef.current(event)
          }
        }
      }
      s.entities = s.entities.filter((e) => e.alive)

      // -- Update particles --
      for (const p of s.particles) {
        p.pos.x += p.vel.x
        p.pos.y += p.vel.y
        p.vel.x *= 0.96
        p.vel.y *= 0.96
        p.life--
      }
      s.particles = s.particles.filter((p) => p.life > 0)

      // -- Update floating texts --
      for (const ft of s.floatingTexts) {
        ft.pos.y -= 0.5
        ft.life--
      }
      s.floatingTexts = s.floatingTexts.filter((ft) => ft.life > 0)

      // -- Update debris --
      for (const d of s.debris) {
        d.pos.x += d.vel.x
        d.pos.y += d.vel.y
        if (d.pos.x < 0) d.pos.x = ARENA_W
        if (d.pos.x > ARENA_W) d.pos.x = 0
        if (d.pos.y < 0) d.pos.y = ARENA_H
        if (d.pos.y > ARENA_H) d.pos.y = 0
      }

      // ── DRAW ─────────────────────────────────────────────
      // Background -- softer deep-ocean blue
      const biomeColor = biomeRef.current.color
      ctx.fillStyle = "#0a1820"
      ctx.fillRect(0, 0, ARENA_W, ARENA_H)

      // Biome tint (slightly stronger for warmth)
      ctx.fillStyle = biomeColor + "12"
      ctx.fillRect(0, 0, ARENA_W, ARENA_H)

      // Debris
      for (const d of s.debris) {
        ctx.beginPath()
        ctx.arc(d.pos.x, d.pos.y, d.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100,140,120,${d.opacity})`
        ctx.fill()
      }

      // Entities
      for (const e of s.entities) {
        if (!e.alive) continue
        const pulse = 1 + Math.sin(e.pulsePhase) * 0.15
        const r = e.radius * pulse

        // Glow
        ctx.beginPath()
        ctx.arc(e.pos.x, e.pos.y, r + 4, 0, Math.PI * 2)
        ctx.fillStyle = e.color + "18"
        ctx.fill()

        // Body
        ctx.beginPath()
        ctx.arc(e.pos.x, e.pos.y, r, 0, Math.PI * 2)
        ctx.fillStyle = e.color
        ctx.fill()
        ctx.strokeStyle = e.color + "80"
        ctx.lineWidth = 1
        ctx.stroke()

        // Eyes for enemies
        if (e.type === "enemy") {
          const eyeOff = r * 0.35
          for (const side of [-1, 1]) {
            ctx.beginPath()
            ctx.arc(e.pos.x + side * eyeOff, e.pos.y - eyeOff * 0.5, 2.5, 0, Math.PI * 2)
            ctx.fillStyle = "#ffe8e8"
            ctx.fill()
            ctx.beginPath()
            ctx.arc(e.pos.x + side * eyeOff, e.pos.y - eyeOff * 0.5, 1, 0, Math.PI * 2)
            ctx.fillStyle = "#662020"
            ctx.fill()
          }
        }

        // Shimmer for loot
        if (e.type === "loot") {
          ctx.beginPath()
          ctx.arc(e.pos.x, e.pos.y, r * 0.4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,200,${0.3 + Math.sin(e.pulsePhase * 2) * 0.2})`
          ctx.fill()
        }

        // Food amorphous shape hint
        if (e.type === "food") {
          ctx.beginPath()
          ctx.arc(e.pos.x + 2, e.pos.y - 1, r * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = e.color + "60"
          ctx.fill()
        }
      }

      // Player cell
      const px = s.player.x
      const py = s.player.y
      const pr = 14

      // Outer glow
      ctx.beginPath()
      ctx.arc(px, py, pr + 6, 0, Math.PI * 2)
      ctx.fillStyle = colorHex + "10"
      ctx.fill()

      // Membrane
      ctx.beginPath()
      ctx.arc(px, py, pr, 0, Math.PI * 2)
      const grad = ctx.createRadialGradient(px - 3, py - 3, 2, px, py, pr)
      grad.addColorStop(0, colorHex + "cc")
      grad.addColorStop(0.7, colorHex + "88")
      grad.addColorStop(1, colorHex + "44")
      ctx.fillStyle = grad
      ctx.fill()
      ctx.strokeStyle = colorHex
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Eyes
      const eyeAngle = s.playerAngle
      for (const side of [-1, 1]) {
        const ex = px + Math.cos(eyeAngle + side * 0.5) * 5
        const ey = py + Math.sin(eyeAngle + side * 0.5) * 5 - 2
        ctx.beginPath()
        ctx.arc(ex, ey, 3, 0, Math.PI * 2)
        ctx.fillStyle = "#e0f0e0"
        ctx.fill()
        // Pupil looking in movement direction
        const pupX = ex + Math.cos(eyeAngle) * 1.2
        const pupY = ey + Math.sin(eyeAngle) * 1.2
        ctx.beginPath()
        ctx.arc(pupX, pupY, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = "#102820"
        ctx.fill()
      }

      // Particles
      for (const p of s.particles) {
        const alpha = p.life / p.maxLife
        ctx.beginPath()
        ctx.arc(p.pos.x, p.pos.y, p.radius * alpha, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, "0")
        ctx.fill()
      }

      // Floating texts
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      for (const ft of s.floatingTexts) {
        const alpha = ft.life / ft.maxLife
        ctx.font = "bold 14px VT323, monospace"
        ctx.fillStyle = ft.color + Math.floor(alpha * 255).toString(16).padStart(2, "0")
        ctx.fillText(ft.text, ft.pos.x, ft.pos.y)
      }

      // Soft border
      ctx.strokeStyle = "#284038"
      ctx.lineWidth = 1
      ctx.strokeRect(0, 0, ARENA_W, ARENA_H)

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [isActive, colorHex, spawnEntity, spawnParticles, spawnText])

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={ARENA_W}
        height={ARENA_H}
        className="w-full max-w-[480px]"
        style={{
          border: "1px solid #284038",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  )
}
