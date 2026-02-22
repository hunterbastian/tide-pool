"use client"

import { UPGRADES, IDLE_UPGRADES, type GameState, type Upgrade } from "@/lib/game-state"
import { Syringe, Shield, Wind, Eye, Leaf, Zap, Heart, Lock } from "lucide-react"

const STAT_ICONS: Record<string, React.ElementType> = {
  syringe: Syringe,
  shield: Shield,
  wind: Wind,
  eye: Eye,
  leaf: Leaf,
  zap: Zap,
  heart: Heart,
}

interface UpgradeShopProps {
  state: GameState
  onPurchase: (upgrade: Upgrade) => void
}

export function UpgradeShop({ state, onPurchase }: UpgradeShopProps) {
  const allUpgrades = [...UPGRADES, ...IDLE_UPGRADES]

  const groups = [
    { label: "Offense", ids: ["tox-1", "tox-2", "tox-3"], color: "#e04040" },
    { label: "Defense", ids: ["mem-1", "mem-2", "mem-3"], color: "#40a0e0" },
    { label: "Speed", ids: ["mot-1", "mot-2", "mot-3"], color: "#3ecf5c" },
    { label: "Senses", ids: ["ada-1", "ada-2", "ada-3"], color: "#f0c040" },
    { label: "Idle Income", ids: ["idle-1", "idle-2", "idle-3"], color: "#c060e0" },
  ]

  return (
    <div className="retro-panel">
      <div className="retro-panel-header">Evolution Lab</div>
      <div className="p-3 flex flex-col gap-3 max-h-[420px] overflow-y-auto">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="font-mono text-[11px] uppercase tracking-wider mb-1.5" style={{ color: group.color }}>
              {group.label}
            </div>
            <div className="flex flex-col gap-1.5">
              {group.ids.map((id) => {
                const upgrade = allUpgrades.find((u) => u.id === id)!
                const owned = state.upgrades.includes(id)
                const tierIndex = parseInt(id.split("-")[1])
                const prefix = id.split("-")[0]
                const prevId = tierIndex > 1 ? `${prefix}-${tierIndex - 1}` : null
                const locked = prevId ? !state.upgrades.includes(prevId) : false
                const canAfford =
                  upgrade.currency === "nutrients"
                    ? state.nutrients >= upgrade.cost
                    : state.biomass >= upgrade.cost
                const Icon = STAT_ICONS[upgrade.icon] || Shield

                return (
                  <button
                    key={id}
                    onClick={() => onPurchase(upgrade)}
                    disabled={owned || locked || !canAfford}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded text-left transition-all text-sm ${
                      owned
                        ? "bg-[#1a3050] border border-[#2a4a6a] opacity-60 cursor-default"
                        : locked
                        ? "bg-[#0f1a2a] border border-[#1a2a3a] opacity-40 cursor-not-allowed"
                        : canAfford
                        ? "retro-btn"
                        : "bg-[#1a2a40] border border-[#2a3a50] opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <span
                      className="flex items-center justify-center w-7 h-7 rounded shrink-0"
                      style={{ background: owned ? "#2a4a6a" : `${group.color}30` }}
                    >
                      {locked ? (
                        <Lock className="w-3.5 h-3.5" style={{ color: "#5a7a9a" }} />
                      ) : (
                        <Icon className="w-3.5 h-3.5" style={{ color: owned ? "#5a7a9a" : group.color }} />
                      )}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-bold text-xs leading-tight" style={{ color: owned ? "#5a7a9a" : "#d0e0ff" }}>
                        {upgrade.name}
                        {owned && <span className="ml-1 text-[10px]" style={{ color: "#3ecf5c" }}>[EVOLVED]</span>}
                      </span>
                      <span className="block text-[10px] leading-tight" style={{ color: "#6090c0" }}>
                        {locked ? "Requires previous tier" : upgrade.description}
                      </span>
                    </span>
                    {!owned && !locked && (
                      <span className="font-mono text-xs font-bold whitespace-nowrap shrink-0" style={{ color: upgrade.currency === "biomass" ? "#c060e0" : "#f0c040" }}>
                        {upgrade.cost} {upgrade.currency === "biomass" ? "BM" : "NUT"}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
