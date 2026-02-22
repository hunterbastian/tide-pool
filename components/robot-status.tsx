"use client"

import type { GameState } from "@/lib/game-state"
import { getTotalPower } from "@/lib/game-state"
import { RobotAvatar, ROBOT_COLORS, HATS } from "@/components/robot-avatar"
import { Syringe, Shield, Wind, Eye, Dna, ChevronLeft, ChevronRight, Paintbrush, Droplets } from "lucide-react"

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
    <div className="flex flex-col items-center gap-3">
      {/* Cell display with level badge */}
      <div className="relative">
        <RobotAvatar
          colorIndex={state.colorIndex}
          hatIndex={state.hatIndex}
          isAdventuring={state.isAdventuring}
          size={160}
          ownedUpgrades={state.upgrades}
        />
        {/* Level badge */}
        <div
          className="absolute -top-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-2"
          style={{
            background: "linear-gradient(180deg, #3a8a4a, #2a7038)",
            borderColor: "#1a5028",
            boxShadow: "0 0 8px rgba(80,187,96,0.15)",
          }}
        >
          <span className="font-mono text-sm font-bold" style={{ color: "#d0f0d0" }}>
            {state.level}
          </span>
        </div>
      </div>

      {/* Name input */}
      <input
        type="text"
        value={state.cellName}
        onChange={(e) => onChangeName(e.target.value)}
        className="w-36 border-b-2 border-dashed bg-transparent text-center text-lg font-bold outline-none transition-colors focus:border-[#50bb60]"
        style={{ color: "#a8b8b2", borderColor: "#284038" }}
        maxLength={16}
        aria-label="Cell name"
      />

      {/* Customization controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Paintbrush className="h-3 w-3" style={{ color: "#508068" }} />
          <button
            onClick={() => onChangeColor((state.colorIndex - 1 + ROBOT_COLORS.length) % ROBOT_COLORS.length)}
            className="p-0.5 rounded transition-colors hover:bg-[#182830]"
            aria-label="Previous color"
          >
            <ChevronLeft className="h-3.5 w-3.5" style={{ color: "#608878" }} />
          </button>
          <div
            className="h-4 w-4 rounded-full border-2"
            style={{
              backgroundColor: ROBOT_COLORS[state.colorIndex % ROBOT_COLORS.length].body,
              borderColor: "#284038",
            }}
          />
          <button
            onClick={() => onChangeColor((state.colorIndex + 1) % ROBOT_COLORS.length)}
            className="p-0.5 rounded transition-colors hover:bg-[#182830]"
            aria-label="Next color"
          >
            <ChevronRight className="h-3.5 w-3.5" style={{ color: "#608878" }} />
          </button>
        </div>

        <div className="w-px h-4" style={{ background: "#284038" }} />

        <div className="flex items-center gap-1">
          <Dna className="h-3 w-3" style={{ color: "#508068" }} />
          <button
            onClick={() => onChangeHat((state.hatIndex - 1 + HATS.length) % HATS.length)}
            className="p-0.5 rounded transition-colors hover:bg-[#182830]"
            aria-label="Previous appendage"
          >
            <ChevronLeft className="h-3.5 w-3.5" style={{ color: "#608878" }} />
          </button>
          <span className="w-20 text-center font-mono text-sm" style={{ color: "#608878" }}>
            {HATS[state.hatIndex % HATS.length] ?? "none"}
          </span>
          <button
            onClick={() => onChangeHat((state.hatIndex + 1) % HATS.length)}
            className="p-0.5 rounded transition-colors hover:bg-[#182830]"
            aria-label="Next appendage"
          >
            <ChevronRight className="h-3.5 w-3.5" style={{ color: "#608878" }} />
          </button>
        </div>
      </div>

      {/* XP Bar */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-sm uppercase tracking-wider" style={{ color: "#508068" }}>Level {state.level}</span>
          <span className="font-mono text-sm" style={{ color: "#508068" }}>{state.xp} / {state.xpToNext} XP</span>
        </div>
        <div className="retro-bar h-4">
          <div
            className="retro-bar-fill"
            style={{
              width: `${xpPercent}%`,
              background: "linear-gradient(180deg, #4a9a58, #3a8a4a, #2a7038)",
            }}
          />
        </div>
      </div>

      {/* Currencies */}
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5" style={{ background: "#0e1c20", border: "1px solid #284038", borderRadius: "6px" }}>
          <Droplets className="h-4 w-4" style={{ color: "#d4a050" }} />
          <span className="font-mono text-base font-bold" style={{ color: "#d4a050" }}>{Math.floor(state.nutrients)}</span>
          <span className="font-mono text-xs" style={{ color: "#608878" }}>NUT</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2" style={{ background: "#140e1c", border: "1px solid #282038", borderRadius: "6px" }}>
          <span className="font-mono text-base font-bold" style={{ color: "#9868a8" }}>{state.biomass}</span>
          <span className="font-mono text-xs" style={{ color: "#608878" }}>BM</span>
        </div>
      </div>

      {/* Idle income rate */}
      <div className="w-full text-center py-1" style={{ background: "#0e1c20", border: "1px solid #284038", borderRadius: "6px" }}>
        <span className="font-mono text-sm" style={{ color: "#50bb60" }}>
          +{state.nutrientsPerSec.toFixed(1)} nutrients/sec
        </span>
      </div>

      {/* Stats */}
      <div className="grid w-full grid-cols-2 gap-1.5">
        <StatBar icon={Syringe} label="TOX" value={state.stats.toxicity} color="#cc6060" />
        <StatBar icon={Shield} label="MEM" value={state.stats.membrane} color="#4098b8" />
        <StatBar icon={Wind} label="MOT" value={state.stats.motility} color="#50bb60" />
        <StatBar icon={Eye} label="ADP" value={state.stats.adaptation} color="#d4a050" />
      </div>

      {/* Power + stats */}
      <div className="flex items-center justify-between w-full">
        <span className="font-mono text-sm" style={{ color: "#508068" }}>
          PWR: <span className="font-bold" style={{ color: "#a8b8b2" }}>{power}</span>
        </span>
        <span className="font-mono text-sm" style={{ color: "#508068" }}>
          {state.totalAdventures} trips / {state.totalDevours} catches
        </span>
      </div>
    </div>
  )
}

function StatBar({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  const maxStat = 40
  const percent = Math.min(100, (value / maxStat) * 100)

  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5" style={{ background: "#0e1c20", border: "1px solid #284038", borderRadius: "6px" }}>
      <Icon className="h-3.5 w-3.5 shrink-0" style={{ color }} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-bold" style={{ color: "#608878" }}>{label}</span>
          <span className="font-mono text-sm font-bold" style={{ color }}>{value}</span>
        </div>
        <div className="retro-bar h-2 mt-0.5">
          <div className="retro-bar-fill" style={{ width: `${percent}%`, background: color }} />
        </div>
      </div>
    </div>
  )
}
