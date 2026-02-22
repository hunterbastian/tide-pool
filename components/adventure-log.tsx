"use client"

import type { AdventureLog } from "@/lib/game-state"
import { Skull, Sparkles, ScrollText, Utensils, Dna } from "lucide-react"

const RESULT_CONFIG = {
  devour:    { icon: Utensils,  color: "#3ecf5c", label: "Devoured!" },
  flee:      { icon: Skull,     color: "#e04040", label: "Fled..." },
  discovery: { icon: Sparkles,  color: "#f0c040", label: "Discovery!" },
  evolution: { icon: Dna,       color: "#c060e0", label: "Evolution!" },
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
          <ScrollText className="h-8 w-8" style={{ color: "#2a4a7a" }} />
          <p className="text-xs" style={{ color: "#5080a0" }}>No expeditions yet. Send your cell exploring!</p>
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
              className="flex items-start gap-2 rounded px-2 py-1.5 border border-[#1a2a3a]"
              style={{ background: "#0a1628" }}
            >
              <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: config.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold" style={{ color: config.color }}>{config.label}</span>
                  <span className="text-[10px]" style={{ color: "#4a6a8a" }}>{log.biome.name}</span>
                  <span className="ml-auto text-[10px] shrink-0" style={{ color: "#3a5a7a" }}>{timeAgo}</span>
                </div>
                <p className="text-[11px] leading-tight mt-0.5" style={{ color: "#8ab0d0" }}>{log.message}</p>
                <div className="flex gap-2 mt-0.5">
                  <span className="font-mono text-[10px] font-bold" style={{ color: "#3ecf5c" }}>+{log.xpGained}xp</span>
                  <span className="font-mono text-[10px] font-bold" style={{ color: "#f0c040" }}>+{log.nutrientsGained}nut</span>
                  {log.biomassGained > 0 && (
                    <span className="font-mono text-[10px] font-bold" style={{ color: "#c060e0" }}>+{log.biomassGained}bm</span>
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
