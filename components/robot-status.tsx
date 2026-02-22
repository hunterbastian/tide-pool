"use client"

import type { GameState } from "@/lib/game-state"
import { getTotalPower } from "@/lib/game-state"
import { RobotAvatar, ROBOT_COLORS, HATS } from "@/components/robot-avatar"
import { cn } from "@/lib/utils"
import { Sword, Shield, Zap, Clover, Dna, ChevronLeft, ChevronRight, Paintbrush, Coins } from "lucide-react"

interface RobotStatusProps {
  state: GameState
  onChangeName: (name: string) => void
  onChangeColor: (index: number) => void
  onChangeHat: (index: number) => void
}

export function RobotStatus({ state, onChangeName, onChangeColor, onChangeHat }: RobotStatusProps) {
  const xpPercent = Math.min(100, (state.xp / state.xpToNext) * 100)
  const power = getTotalPower(state.stats)

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Robot display */}
      <div className="relative">
        <RobotAvatar
          colorIndex={state.colorIndex}
          hatIndex={state.hatIndex}
          isAdventuring={state.isAdventuring}
          size={180}
        />

        {/* Level badge */}
        <div className="absolute -top-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <span className="text-sm font-bold">{state.level}</span>
        </div>
      </div>

      {/* Name */}
      <input
        type="text"
        value={state.robotName}
        onChange={(e) => onChangeName(e.target.value)}
        className="w-40 border-b-2 border-dashed border-border bg-transparent text-center text-xl font-bold text-foreground outline-none transition-colors focus:border-primary"
        maxLength={16}
        aria-label="Robot name"
      />

      {/* Customization controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Paintbrush className="h-3.5 w-3.5 text-muted-foreground" />
          <button
            onClick={() => onChangeColor((state.colorIndex - 1 + ROBOT_COLORS.length) % ROBOT_COLORS.length)}
            className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Previous color"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div
            className="h-5 w-5 rounded-full border-2 border-border"
            style={{ backgroundColor: ROBOT_COLORS[state.colorIndex % ROBOT_COLORS.length].body }}
          />
          <button
            onClick={() => onChangeColor((state.colorIndex + 1) % ROBOT_COLORS.length)}
            className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Next color"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-1">
          <Dna className="h-3.5 w-3.5 text-muted-foreground" />
          <button
            onClick={() => onChangeHat((state.hatIndex - 1 + HATS.length) % HATS.length)}
            className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Previous hat"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="w-14 text-center text-xs font-medium text-muted-foreground">
            {HATS[state.hatIndex % HATS.length] ?? "none"}
          </span>
          <button
            onClick={() => onChangeHat((state.hatIndex + 1) % HATS.length)}
            className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Next hat"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* XP Bar */}
      <div className="w-full">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Level {state.level}</span>
          <span>{state.xp} / {state.xpToNext} XP</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>

      {/* Coins */}
      <div className="flex items-center gap-1.5 rounded-full bg-accent/20 px-4 py-2">
        <Coins className="h-5 w-5 text-accent-foreground" />
        <span className="font-mono text-lg font-bold text-accent-foreground">{state.coins}</span>
      </div>

      {/* Stats */}
      <div className="grid w-full grid-cols-2 gap-2">
        <StatBar icon={Sword} label="Attack" value={state.stats.attack} color="text-chart-3" />
        <StatBar icon={Shield} label="Defense" value={state.stats.defense} color="text-chart-4" />
        <StatBar icon={Zap} label="Speed" value={state.stats.speed} color="text-primary" />
        <StatBar icon={Clover} label="Luck" value={state.stats.luck} color="text-chart-5" />
      </div>

      {/* Power */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Total Power:</span>
        <span className="font-mono font-bold text-foreground">{power}</span>
      </div>

      {/* Stats summary */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>Adventures: {state.totalAdventures}</span>
        <span>Victories: {state.totalVictories}</span>
      </div>
    </div>
  )
}

function StatBar({ icon: Icon, label, value, color }: { icon: typeof Sword; label: string; value: number; color: string }) {
  const maxStat = 40
  const percent = Math.min(100, (value / maxStat) * 100)

  return (
    <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
      <Icon className={cn("h-4 w-4 shrink-0", color)} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">{label}</span>
          <span className="font-mono text-xs font-bold text-foreground">{value}</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className={cn("h-full rounded-full transition-all duration-500", color.replace("text-", "bg-"))}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
