"use client"

import { UPGRADES, IDLE_UPGRADES, type GameState, type Upgrade, getFragmentDiscount, FRAGMENT_NUTRIENT_VALUE, FRAGMENT_BIOMASS_VALUE } from "@/lib/game-state"
import { Syringe, Shield, Wind, Eye, Leaf, Zap, Heart, Lock, Gem } from "lucide-react"

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
  onPurchaseWithFragments: (upgrade: Upgrade) => void
}

export function UpgradeShop({ state, onPurchase, onPurchaseWithFragments }: UpgradeShopProps) {
  const allUpgrades = [...UPGRADES, ...IDLE_UPGRADES]

  const groups = [
    { label: "Offense", ids: ["tox-1", "tox-2", "tox-3"], color: "#cc6060" },
    { label: "Defense", ids: ["mem-1", "mem-2", "mem-3"], color: "#4098b8" },
    { label: "Speed", ids: ["mot-1", "mot-2", "mot-3"], color: "#50bb60" },
    { label: "Senses", ids: ["ada-1", "ada-2", "ada-3"], color: "#d4a050" },
    { label: "Passive Income", ids: ["idle-1", "idle-2", "idle-3"], color: "#9868a8" },
  ]

  return (
    <div className="retro-panel">
      <div className="retro-panel-header flex items-center justify-between">
        <span>Evolution Lab</span>
        {state.mutationFragments > 0 && (
          <span className="flex items-center gap-1 normal-case tracking-normal text-sm" style={{ color: "#d4a050" }}>
            <Gem className="h-3.5 w-3.5" />
            {state.mutationFragments} fragments
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-3 max-h-[420px] overflow-y-auto">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="font-mono text-sm uppercase tracking-wider mb-1.5" style={{ color: group.color }}>
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
                    className={`flex items-center gap-2.5 px-2.5 py-2 text-left transition-all text-sm ${
                      owned
                        ? "bg-[#0e1c20] border border-[#284038] opacity-50 cursor-default"
                        : locked
                        ? "bg-[#0a1618] border border-[#142020] opacity-30 cursor-not-allowed"
                        : canAfford
                        ? "retro-btn"
                        : "bg-[#0e1c20] border border-[#1a2828] opacity-40 cursor-not-allowed"
                    }`}
                    style={{ borderRadius: "6px" }}
                  >
                    <span
                      className="flex items-center justify-center w-7 h-7 rounded shrink-0"
                      style={{ background: owned ? "#1a2828" : `${group.color}20` }}
                    >
                      {locked ? (
                        <Lock className="w-3.5 h-3.5" style={{ color: "#304840" }} />
                      ) : (
                        <Icon className="w-3.5 h-3.5" style={{ color: owned ? "#304840" : group.color }} />
                      )}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-bold text-sm leading-tight" style={{ color: owned ? "#508068" : "#a8b8b2" }}>
                        {upgrade.name}
                        {owned && <span className="ml-1 text-xs" style={{ color: "#50bb60" }}>[EVOLVED]</span>}
                      </span>
                      <span className="block text-xs leading-snug" style={{ color: "#508068" }}>
                        {locked ? "Evolve previous tier first" : upgrade.description}
                      </span>
                    </span>
                    {!owned && !locked && (() => {
                      const { fragmentsUsed, discount } = getFragmentDiscount(upgrade, state.mutationFragments)
                      const discountedCost = upgrade.cost - discount
                      const canAffordWithFrags = upgrade.currency === "nutrients"
                        ? state.nutrients >= discountedCost
                        : state.biomass >= discountedCost
                      return (
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                          <span className="font-mono text-sm font-bold whitespace-nowrap" style={{ color: upgrade.currency === "biomass" ? "#9868a8" : "#d4a050" }}>
                            {upgrade.cost} {upgrade.currency === "biomass" ? "BM" : "NUT"}
                          </span>
                          {fragmentsUsed > 0 && !canAfford && canAffordWithFrags && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onPurchaseWithFragments(upgrade) }}
                              className="font-mono text-xs whitespace-nowrap px-1.5 py-0.5"
                              style={{
                                background: "linear-gradient(180deg, #d4a050, #b88838)",
                                color: "#1a1000",
                                border: "1px solid #806018",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: 700,
                              }}
                            >
                              Use {fragmentsUsed} frags ({discountedCost} {upgrade.currency === "biomass" ? "BM" : "NUT"})
                            </button>
                          )}
                        </div>
                      )
                    })()}
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
