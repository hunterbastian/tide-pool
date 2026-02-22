"use client"

import type { AdventureLog } from "@/lib/game-state"
import { Skull, Sparkles, ScrollText, Utensils, Dna } from "lucide-react"

const RESULT_CONFIG = {
  devour:    { icon: Utensils,  color: "#50bb60", label: "CAUGHT" },
  flee:      { icon: Skull,     color: "#cc6060", label: "FLED" },
  discovery: { icon: Sparkles,  color: "#d4a050", label: "FOUND" },
  evolution: { icon: Dna,       color: "#9868a8", label: "EVOLVED" },
}

interface AdventureLogViewProps {
  logs: AdventureLog[]
}

export function AdventureLogView({ logs }: AdventureLogViewProps) {
  if (logs.length === 0) {
    return (
      <div className="retro-panel">
        <div className="retro-panel-header">Expedition Log</div>
        <div className="flex flex-col items-center gap-2 py-8">
          <ScrollText className="h-8 w-8" style={{ color: "#284038" }} />
          <p className="text-sm font-mono" style={{ color: "#508068" }}>No expeditions yet. Send your cell out to explore!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="retro-panel">
      <div className="retro-panel-header">Expedition Log</div>
      <div className="p-2 flex flex-col gap-1 max-h-[300px] overflow-y-auto">
        {[...logs].reverse().slice(0, 20).map((log) => {
          const config = RESULT_CONFIG[log.result]
          const Icon = config.icon
          const timeAgo = getTimeAgo(log.timestamp)

          return (
            <div
              key={log.id}
              className="flex items-start gap-2 px-2 py-1.5 border border-[#1a2828]"
              style={{ background: "#0a1618", borderRadius: "6px" }}
            >
              <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: config.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold" style={{ color: config.color }}>{config.label}</span>
                  <span className="text-sm" style={{ color: "#508068" }}>{log.biome.name}</span>
                  <span className="ml-auto text-xs shrink-0" style={{ color: "#406050" }}>{timeAgo}</span>
                </div>
                <p className="text-sm leading-snug mt-0.5" style={{ color: "#80a098" }}>{log.message}</p>
                <div className="flex gap-2 mt-0.5">
                  <span className="font-mono text-sm font-bold" style={{ color: "#50bb60" }}>+{log.xpGained}xp</span>
                  <span className="font-mono text-sm font-bold" style={{ color: "#d4a050" }}>+{log.nutrientsGained}nut</span>
                  {log.biomassGained > 0 && (
                    <span className="font-mono text-sm font-bold" style={{ color: "#9868a8" }}>+{log.biomassGained}bm</span>
                  )}
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
