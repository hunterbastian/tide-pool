"use client"

import { ADVENTURE_ZONES, type GameState, type AdventureZone } from "@/lib/game-state"
import { cn } from "@/lib/utils"
import { Flower2, Trash2, TreePine, Gem, Flame, Rocket, Lock, Timer, Swords } from "lucide-react"
import { useEffect, useState } from "react"

const ZONE_ICONS: Record<string, typeof Flower2> = {
  garden: Flower2,
  junkyard: Trash2,
  forest: TreePine,
  cave: Gem,
  volcano: Flame,
  space: Rocket,
}

const ZONE_COLORS: Record<string, string> = {
  garden: "from-[#95E66A]/20 to-[#4ECDC4]/20 border-[#95E66A]/40",
  junkyard: "from-[#FFB84D]/20 to-[#CC9340]/20 border-[#FFB84D]/40",
  forest: "from-[#4ECDC4]/20 to-[#3BA89F]/20 border-[#4ECDC4]/40",
  cave: "from-[#7C83FD]/20 to-[#5F65CC]/20 border-[#7C83FD]/40",
  volcano: "from-[#FF6B6B]/20 to-[#CC5555]/20 border-[#FF6B6B]/40",
  space: "from-[#2D2D2D]/20 to-[#7C83FD]/20 border-[#7C83FD]/40",
}

interface AdventurePanelProps {
  state: GameState
  onAdventure: (zone: AdventureZone) => void
}

export function AdventurePanel({ state, onAdventure }: AdventurePanelProps) {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (!state.isAdventuring || !state.adventureEndTime) return

    const interval = setInterval(() => {
      const remaining = Math.max(0, state.adventureEndTime! - Date.now())
      setTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [state.isAdventuring, state.adventureEndTime])

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000)
    return `${seconds}s`
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Adventures</h2>
        {state.isAdventuring && state.currentZone && (
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
            <Timer className="h-4 w-4 animate-spin text-primary" style={{ animationDuration: "3s" }} />
            <span className="font-mono text-sm font-bold text-primary">
              {timeLeft > 0 ? formatTime(timeLeft) : "Returning..."}
            </span>
          </div>
        )}
      </div>

      {state.isAdventuring && state.currentZone && (
        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
          <p className="text-center text-sm font-medium text-foreground">
            Your robot is exploring <span className="font-bold text-primary">{state.currentZone.name}</span>!
          </p>
          <div className="mt-2 flex justify-center gap-1">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="inline-block h-2 w-2 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ADVENTURE_ZONES.map((zone) => {
          const Icon = ZONE_ICONS[zone.emoji] || Swords
          const unlocked = state.level >= zone.requiredLevel
          const isCurrent = state.currentZone?.id === zone.id && state.isAdventuring

          return (
            <button
              key={zone.id}
              onClick={() => !state.isAdventuring && unlocked && onAdventure(zone)}
              disabled={state.isAdventuring || !unlocked}
              className={cn(
                "relative flex flex-col gap-2 rounded-xl border-2 bg-gradient-to-br p-4 text-left transition-all",
                ZONE_COLORS[zone.emoji],
                unlocked && !state.isAdventuring && "cursor-pointer hover:scale-[1.02] hover:shadow-md active:scale-[0.98]",
                !unlocked && "opacity-40",
                state.isAdventuring && unlocked && !isCurrent && "opacity-50",
                isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card/60">
                  {unlocked ? (
                    <Icon className="h-5 w-5 text-foreground" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground">{zone.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{zone.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {unlocked ? `~${zone.baseDuration}s` : `Lvl ${zone.requiredLevel}`}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-primary">+{zone.baseReward.xp} XP</span>
                  <span className="font-medium text-accent-foreground">+{zone.baseReward.coins} coins</span>
                </div>
              </div>
              {/* Danger indicator */}
              <div className="flex gap-0.5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 w-4 rounded-full",
                      i < zone.dangerLevel ? "bg-chart-3/60" : "bg-border"
                    )}
                  />
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
