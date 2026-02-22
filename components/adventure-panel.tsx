"use client"

import { BIOMES, type GameState, type Biome, type ArenaEvent, getTotalPower } from "@/lib/game-state"
import { ArenaView } from "@/components/arena-view"
import { Lock, Timer } from "lucide-react"
import { useEffect, useState } from "react"

interface AdventurePanelProps {
  state: GameState
  colorHex: string
  onAdventure: (biome: Biome) => void
  onArenaEvent: (event: ArenaEvent) => void
}

export function AdventurePanel({ state, colorHex, onAdventure, onArenaEvent }: AdventurePanelProps) {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (!state.isAdventuring || !state.adventureEndTime) return
    const interval = setInterval(() => {
      const remaining = Math.max(0, state.adventureEndTime! - Date.now())
      setTimeLeft(remaining)
      if (remaining <= 0) clearInterval(interval)
    }, 100)
    return () => clearInterval(interval)
  }, [state.isAdventuring, state.adventureEndTime])

  const formatTime = (ms: number) => `${Math.ceil(ms / 1000)}s`
  const power = getTotalPower(state.stats)

  return (
    <div className="retro-panel">
      <div className="retro-panel-header flex items-center justify-between">
        <span>Biome Explorer</span>
        {state.isAdventuring && (
          <span className="flex items-center gap-1.5 text-[#44aa44] text-sm normal-case tracking-normal">
            <Timer className="h-4 w-4 animate-spin" style={{ animationDuration: "3s" }} />
            {timeLeft > 0 ? formatTime(timeLeft) : "Returning..."}
          </span>
        )}
      </div>

      {/* Active arena */}
      {state.isAdventuring && state.currentBiome && (
        <div className="mx-3 mt-3 flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2 py-1">
            <span className="font-mono text-sm font-bold uppercase tracking-wider" style={{ color: "#44aa44", textShadow: "0 0 4px rgba(68,170,68,0.2)" }}>
              Hunting in {state.currentBiome.name}
            </span>
          </div>
          <ArenaView
            biome={state.currentBiome}
            stats={state.stats}
            colorHex={colorHex}
            isActive={state.isAdventuring}
            onArenaEvent={onArenaEvent}
          />
          {/* Recent arena events */}
          {state.arenaEvents.length > 0 && (
            <div className="flex flex-col gap-0.5 max-h-20 overflow-y-auto px-1">
              {state.arenaEvents.slice(-3).map((evt) => (
                <p key={evt.id} className="text-xs font-mono leading-snug" style={{ color: evt.type === "lost_fight" ? "#aa3030" : "#4a6058" }}>
                  {evt.message}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="p-3 flex flex-col gap-2 max-h-[420px] overflow-y-auto">
        {BIOMES.map((biome) => {
          const unlocked = state.level >= biome.requiredLevel
          const isCurrent = state.currentBiome?.id === biome.id && state.isAdventuring
          const successEst = Math.min(90, Math.floor((0.3 + (power / (biome.dangerLevel * 10)) * 0.15) * 100))

          return (
            <button
              key={biome.id}
              onClick={() => !state.isAdventuring && unlocked && onAdventure(biome)}
              disabled={state.isAdventuring || !unlocked}
              className={`flex flex-col gap-1.5 px-3 py-2.5 text-left transition-all border-2 ${
                isCurrent
                  ? "border-[#44aa44] bg-[#0e1a12]"
                  : unlocked && !state.isAdventuring
                  ? "border-[#1e3028] hover:border-[#2a4a30] cursor-pointer"
                  : unlocked
                  ? "border-[#121a14] opacity-50"
                  : "border-[#0a1010] opacity-25 cursor-not-allowed"
              }`}
              style={{
                borderRadius: "2px",
                background: isCurrent
                  ? undefined
                  : unlocked
                  ? `linear-gradient(90deg, ${biome.color}10, transparent)`
                  : "#040808",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {unlocked ? (
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: biome.color, boxShadow: `0 0 6px ${biome.color}80` }}
                    />
                  ) : (
                    <Lock className="w-3 h-3 shrink-0" style={{ color: "#2a3a32" }} />
                  )}
                  <span className="font-bold text-sm" style={{ color: unlocked ? "#99a8a2" : "#2a3a32" }}>
                    {biome.name}
                  </span>
                </div>
                {unlocked && (
                  <span className="font-mono text-sm" style={{ color: "#4a6058" }}>
                    ~{biome.baseDuration}s
                  </span>
                )}
              </div>

              <p className="text-sm leading-snug" style={{ color: "#3a5040" }}>
                {unlocked ? biome.description : `Requires Level ${biome.requiredLevel}`}
              </p>

              {unlocked && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold" style={{ color: "#44aa44" }}>+{biome.baseReward.xp}xp</span>
                    <span className="font-mono text-sm font-bold" style={{ color: "#c89030" }}>+{biome.baseReward.nutrients}nut</span>
                    {biome.baseReward.biomass > 0 && (
                      <span className="font-mono text-sm font-bold" style={{ color: "#884488" }}>+{biome.baseReward.biomass}bm</span>
                    )}
                  </div>
                  {/* Success estimate */}
                  <span className="font-mono text-sm" style={{ color: successEst > 60 ? "#44aa44" : successEst > 35 ? "#c89030" : "#aa3030" }}>
                    {successEst}%
                  </span>
                </div>
              )}

              {/* Danger bar */}
              {unlocked && (
                <div className="flex gap-0.5">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-sm"
                      style={{
                        background: i < biome.dangerLevel ? biome.color : "#0a1010",
                        opacity: i < biome.dangerLevel ? 0.7 : 1,
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
