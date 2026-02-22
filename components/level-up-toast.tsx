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
          "flex flex-col items-center gap-3 rounded-2xl bg-card border-2 border-primary/30 px-10 py-8 shadow-2xl transition-all duration-300",
          visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
        )}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 ring-4 ring-primary/10">
          <span className="text-3xl font-bold text-primary">{level}</span>
        </div>
        <p className="text-2xl font-bold text-foreground">Level Up!</p>
        <p className="text-sm text-muted-foreground">Your robot grew stronger!</p>
        <div className="flex gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-ping"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1s" }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
