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
          className="absolute -top-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2"
          style={{
            background: "linear-gradient(180deg, #3ecf5c, #22a83a)",
            borderColor: "#16702a",
            boxShadow: "0 0 8px rgba(62,207,92,0.4)",
          }}
        >
          <span className="font-mono text-xs font-bold" style={{ color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
            {state.level}
          </span>
        </div>
      </div>

      {/* Name input */}
      <input
        type="text"
        value={state.cellName}
        onChange={(e) => onChangeName(e.target.value)}
        className="w-36 border-b-2 border-dashed bg-transparent text-center text-lg font-bold outline-none transition-colors focus:border-[#3ecf5c]"
        style={{ color: "#d0e0ff", borderColor: "#2a4a7a" }}
        maxLength={16}
        aria-label="Cell name"
      />

      {/* Customization controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Paintbrush className="h-3 w-3" style={{ color: "#5080a0" }} />
          <button
            onClick={() => onChangeColor((state.colorIndex - 1 + ROBOT_COLORS.length) % ROBOT_COLORS.length)}
            className="p-0.5 rounded transition-colors hover:bg-[#1a3560]"
            aria-label="Previous color"
          >
            <ChevronLeft className="h-3.5 w-3.5" style={{ color: "#6090c0" }} />
          </button>
          <div
            className="h-4 w-4 rounded-full border-2"
            style={{
              backgroundColor: ROBOT_COLORS[state.colorIndex % ROBOT_COLORS.length].body,
              borderColor: "#2a4a7a",
            }}
          />
          <button
            onClick={() => onChangeColor((state.colorIndex + 1) % ROBOT_COLORS.length)}
            className="p-0.5 rounded transition-colors hover:bg-[#1a3560]"
            aria-label="Next color"
          >
            <ChevronRight className="h-3.5 w-3.5" style={{ color: "#6090c0" }} />
          </button>
        </div>

        <div className="w-px h-4" style={{ background: "#2a4a7a" }} />

        <div className="flex items-center gap-1">
          <Dna className="h-3 w-3" style={{ color: "#5080a0" }} />
          <button
            onClick={() => onChangeHat((state.hatIndex - 1 + HATS.length) % HATS.length)}
            className="p-0.5 rounded transition-colors hover:bg-[#1a3560]"
            aria-label="Previous appendage"
          >
            <ChevronLeft className="h-3.5 w-3.5" style={{ color: "#6090c0" }} />
          </button>
          <span className="w-16 text-center font-mono text-[10px]" style={{ color: "#6090c0" }}>
            {HATS[state.hatIndex % HATS.length] ?? "none"}
          </span>
          <button
            onClick={() => onChangeHat((state.hatIndex + 1) % HATS.length)}
            className="p-0.5 rounded transition-colors hover:bg-[#1a3560]"
            aria-label="Next appendage"
          >
            <ChevronRight className="h-3.5 w-3.5" style={{ color: "#6090c0" }} />
          </button>
        </div>
      </div>

      {/* XP Bar */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] uppercase" style={{ color: "#5080a0" }}>Level {state.level}</span>
          <span className="font-mono text-[10px]" style={{ color: "#5080a0" }}>{state.xp} / {state.xpToNext} XP</span>
        </div>
        <div className="retro-bar h-3">
          <div
            className="retro-bar-fill"
            style={{
              width: `${xpPercent}%`,
              background: "linear-gradient(180deg, #50e070, #3ecf5c, #2aaa40)",
            }}
          />
        </div>
      </div>

      {/* Currencies */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 flex items-center justify-center gap-1.5 rounded py-1.5" style={{ background: "#1a3050", border: "1px solid #2a4a6a" }}>
          <Droplets className="h-3.5 w-3.5" style={{ color: "#f0c040" }} />
          <span className="font-mono text-sm font-bold" style={{ color: "#f0c040" }}>{Math.floor(state.nutrients)}</span>
          <span className="font-mono text-[9px]" style={{ color: "#6090c0" }}>NUT</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5 rounded py-1.5" style={{ background: "#1a2040", border: "1px solid #2a3a6a" }}>
          <span className="font-mono text-sm font-bold" style={{ color: "#c060e0" }}>{state.biomass}</span>
          <span className="font-mono text-[9px]" style={{ color: "#6090c0" }}>BM</span>
        </div>
      </div>

      {/* Idle income rate */}
      <div className="w-full text-center py-1 rounded" style={{ background: "#0f1a2a", border: "1px solid #1a2a3a" }}>
        <span className="font-mono text-[10px]" style={{ color: "#3ecf5c" }}>
          +{state.nutrientsPerSec.toFixed(1)} nutrients/sec
        </span>
      </div>

      {/* Stats */}
      <div className="grid w-full grid-cols-2 gap-1.5">
        <StatBar icon={Syringe} label="TOX" value={state.stats.toxicity} color="#e04040" />
        <StatBar icon={Shield} label="MEM" value={state.stats.membrane} color="#40a0e0" />
        <StatBar icon={Wind} label="MOT" value={state.stats.motility} color="#3ecf5c" />
        <StatBar icon={Eye} label="ADP" value={state.stats.adaptation} color="#f0c040" />
      </div>

      {/* Power + stats */}
      <div className="flex items-center justify-between w-full">
        <span className="font-mono text-[10px]" style={{ color: "#5080a0" }}>
          PWR: <span className="font-bold" style={{ color: "#d0e0ff" }}>{power}</span>
        </span>
        <span className="font-mono text-[10px]" style={{ color: "#5080a0" }}>
          {state.totalAdventures} exp / {state.totalDevours} devoured
        </span>
      </div>
    </div>
  )
}

function StatBar({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  const maxStat = 40
  const percent = Math.min(100, (value / maxStat) * 100)

  return (
    <div className="flex items-center gap-1.5 rounded px-2 py-1.5" style={{ background: "#0f1a2a", border: "1px solid #1a2a3a" }}>
      <Icon className="h-3 w-3 shrink-0" style={{ color }} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold" style={{ color: "#6090c0" }}>{label}</span>
          <span className="font-mono text-[10px] font-bold" style={{ color }}>{value}</span>
        </div>
        <div className="retro-bar h-1.5 mt-0.5">
          <div className="retro-bar-fill" style={{ width: `${percent}%`, background: color }} />
        </div>
      </div>
    </div>
  )
}
