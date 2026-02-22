"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface LevelUpToastProps {
  level: number
  show: boolean
  onDone: () => void
}

export function LevelUpToast({ level, show, onDone }: LevelUpToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onDone, 300)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [show, onDone])

  if (!show && !visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className={cn(
          "flex flex-col items-center gap-3 rounded px-10 py-8 transition-all duration-300",
          visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
        )}
        style={{
          background: "linear-gradient(180deg, #142a20 0%, #0e2018 100%)",
          border: "2px solid #50bb60",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(80,187,96,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(180deg, #3a8a4a, #2a7038)",
            border: "2px solid #1a5028",
            borderRadius: "50%",
            boxShadow: "0 0 16px rgba(80,187,96,0.2)",
          }}
        >
          <span className="font-mono text-2xl font-bold" style={{ color: "#d0f0d0" }}>
            {level}
          </span>
        </div>
        <p className="text-xl font-bold font-mono uppercase tracking-wider" style={{ color: "#50bb60" }}>
          LEVEL UP!
        </p>
        <p className="text-xs font-mono" style={{ color: "#608878" }}>Your cell is getting stronger!</p>
        <div className="flex gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="inline-block h-1.5 w-1.5 rounded-full animate-ping"
              style={{ background: "#50bb60", animationDelay: `${i * 0.15}s`, animationDuration: "1s" }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
