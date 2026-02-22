"use client"

import type { AdventureLog } from "@/lib/game-state"
import { cn } from "@/lib/utils"
import { Trophy, Skull, Gem, Sparkles, ScrollText } from "lucide-react"

const RESULT_CONFIG = {
  victory: { icon: Trophy, color: "text-primary", bg: "bg-primary/10", label: "Victory!" },
  defeat: { icon: Skull, color: "text-chart-3", bg: "bg-chart-3/10", label: "Oops..." },
  treasure: { icon: Gem, color: "text-accent-foreground", bg: "bg-accent/20", label: "Treasure!" },
  event: { icon: Sparkles, color: "text-chart-4", bg: "bg-chart-4/10", label: "Event!" },
}

interface AdventureLogViewProps {
  logs: AdventureLog[]
}

export function AdventureLogView({ logs }: AdventureLogViewProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <ScrollText className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No adventures yet! Send your robot out to explore.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold text-foreground">Adventure Log</h2>
      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
        {[...logs].reverse().map((log) => {
          const config = RESULT_CONFIG[log.result]
          const Icon = config.icon
          const timeAgo = getTimeAgo(log.timestamp)

          return (
            <div
              key={log.id}
              className={cn(
                "flex items-start gap-3 rounded-xl border border-border/50 p-3 transition-all",
                config.bg
              )}
            >
              <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", config.bg)}>
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-bold", config.color)}>{config.label}</span>
                  <span className="text-xs text-muted-foreground">{log.zone.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground shrink-0">{timeAgo}</span>
                </div>
                <p className="text-sm text-foreground mt-0.5">{log.message}</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs font-medium text-primary">+{log.xpGained} XP</span>
                  <span className="text-xs font-medium text-accent-foreground">+{log.coinsGained} coins</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}
