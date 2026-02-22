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
          background: "linear-gradient(180deg, #0e1a12 0%, #060d08 100%)",
          border: "3px solid #44aa44",
          boxShadow: "0 0 30px rgba(68,170,68,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(180deg, #2a6a2a, #1a4a1a)",
            border: "3px solid #0e2a0e",
            boxShadow: "0 0 12px rgba(68,170,68,0.3)",
          }}
        >
          <span className="font-mono text-2xl font-bold" style={{ color: "#c0e0c0", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
            {level}
          </span>
        </div>
        <p className="text-xl font-bold font-mono uppercase tracking-wider" style={{ color: "#44aa44", textShadow: "0 0 6px rgba(68,170,68,0.3)" }}>
          MUTATION
        </p>
        <p className="text-xs font-mono" style={{ color: "#4a6058" }}>Something changed inside you.</p>
        <div className="flex gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="inline-block h-1.5 w-1.5 rounded-full animate-ping"
              style={{ background: "#44aa44", animationDelay: `${i * 0.15}s`, animationDuration: "1s" }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
