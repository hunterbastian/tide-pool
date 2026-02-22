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
          background: "linear-gradient(180deg, #1a4040 0%, #0a2030 100%)",
          border: "3px solid #3ecf5c",
          boxShadow: "0 0 30px rgba(62,207,92,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(180deg, #4ade60, #22a83a)",
            border: "3px solid #16702a",
            boxShadow: "0 0 16px rgba(62,207,92,0.5)",
          }}
        >
          <span className="font-mono text-2xl font-bold" style={{ color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
            {level}
          </span>
        </div>
        <p className="text-xl font-bold" style={{ color: "#3ecf5c", textShadow: "0 0 8px rgba(62,207,92,0.4)" }}>
          EVOLUTION!
        </p>
        <p className="text-xs" style={{ color: "#6090c0" }}>Your cell grew stronger!</p>
        <div className="flex gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="inline-block h-1.5 w-1.5 rounded-full animate-ping"
              style={{ background: "#3ecf5c", animationDelay: `${i * 0.15}s`, animationDuration: "1s" }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
