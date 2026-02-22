"use client"

import { BIOMES, type GameState, type Biome, getTotalPower } from "@/lib/game-state"
import { Lock, Timer } from "lucide-react"
import { useEffect, useState } from "react"

interface AdventurePanelProps {
  state: GameState
  onAdventure: (biome: Biome) => void
}

export function AdventurePanel({ state, onAdventure }: AdventurePanelProps) {
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
          <span className="flex items-center gap-1.5 text-[#3ecf5c] text-xs normal-case tracking-normal">
            <Timer className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "3s" }} />
            {timeLeft > 0 ? formatTime(timeLeft) : "Returning..."}
          </span>
        )}
      </div>

      {/* Active adventure banner */}
      {state.isAdventuring && state.currentBiome && (
        <div className="mx-3 mt-3 rounded border border-[#3ecf5c]/30 px-3 py-2" style={{ background: "linear-gradient(180deg, #1a4030 0%, #0f2a20 100%)" }}>
          <p className="text-center text-xs font-bold" style={{ color: "#3ecf5c" }}>
            Exploring {state.currentBiome.name}...
          </p>
          <div className="mt-1 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="inline-block h-1.5 w-1.5 rounded-full animate-bounce"
                style={{ background: "#3ecf5c", animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
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
              className={`flex flex-col gap-1.5 rounded px-3 py-2.5 text-left transition-all border-2 ${
                isCurrent
                  ? "border-[#3ecf5c] bg-[#1a4030]"
                  : unlocked && !state.isAdventuring
                  ? "border-[#2a4a7a] hover:border-[#3a6aaa] cursor-pointer"
                  : unlocked
                  ? "border-[#1a2a3a] opacity-50"
                  : "border-[#1a2030] opacity-30 cursor-not-allowed"
              }`}
              style={{
                background: isCurrent
                  ? undefined
                  : unlocked
                  ? `linear-gradient(90deg, ${biome.color}15, transparent)`
                  : "#0a1020",
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
                    <Lock className="w-3 h-3 shrink-0" style={{ color: "#3a5a7a" }} />
                  )}
                  <span className="font-bold text-xs" style={{ color: unlocked ? "#d0e0ff" : "#3a5a7a" }}>
                    {biome.name}
                  </span>
                </div>
                {unlocked && (
                  <span className="font-mono text-[10px]" style={{ color: "#6090c0" }}>
                    ~{biome.baseDuration}s
                  </span>
                )}
              </div>

              <p className="text-[10px] leading-tight" style={{ color: "#5080a0" }}>
                {unlocked ? biome.description : `Requires Level ${biome.requiredLevel}`}
              </p>

              {unlocked && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] font-bold" style={{ color: "#3ecf5c" }}>+{biome.baseReward.xp}xp</span>
                    <span className="font-mono text-[10px] font-bold" style={{ color: "#f0c040" }}>+{biome.baseReward.nutrients}nut</span>
                    {biome.baseReward.biomass > 0 && (
                      <span className="font-mono text-[10px] font-bold" style={{ color: "#c060e0" }}>+{biome.baseReward.biomass}bm</span>
                    )}
                  </div>
                  {/* Success estimate */}
                  <span className="font-mono text-[10px]" style={{ color: successEst > 60 ? "#3ecf5c" : successEst > 35 ? "#f0c040" : "#e04040" }}>
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
                        background: i < biome.dangerLevel ? biome.color : "#1a2a3a",
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
