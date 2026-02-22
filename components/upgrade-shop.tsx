"use client"

import { UPGRADES, type GameState, type Upgrade } from "@/lib/game-state"
import { cn } from "@/lib/utils"
import { Shield, Sword, Zap, Clover, Lock, Check, Coins } from "lucide-react"

const STAT_ICONS: Record<string, typeof Sword> = {
  sword: Sword,
  shield: Shield,
  boots: Zap,
  clover: Clover,
}

const TIER_COLORS: Record<number, string> = {
  1: "border-primary/30 bg-card",
  2: "border-accent/50 bg-accent/5",
  3: "border-chart-3/50 bg-chart-3/5",
}

interface UpgradeShopProps {
  state: GameState
  onPurchase: (upgrade: Upgrade) => void
}

export function UpgradeShop({ state, onPurchase }: UpgradeShopProps) {
  const groupedByStatAndTier = UPGRADES.reduce((acc, upgrade) => {
    const key = upgrade.stat
    if (!acc[key]) acc[key] = []
    acc[key].push(upgrade)
    return acc
  }, {} as Record<string, Upgrade[]>)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Upgrade Shop</h2>
        <div className="flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1.5">
          <Coins className="h-4 w-4 text-accent-foreground" />
          <span className="font-mono text-sm font-bold text-accent-foreground">{state.coins}</span>
        </div>
      </div>

      {Object.entries(groupedByStatAndTier).map(([stat, upgrades]) => (
        <div key={stat} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {stat}
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {upgrades.sort((a, b) => a.tier - b.tier).map((upgrade) => {
              const Icon = STAT_ICONS[upgrade.icon] || Sword
              const owned = state.upgrades.includes(upgrade.id)
              const canAfford = state.coins >= upgrade.cost
              const prevTierOwned = upgrade.tier === 1 || state.upgrades.some(
                (id) => UPGRADES.find((u) => u.id === id)?.stat === upgrade.stat && 
                        (UPGRADES.find((u) => u.id === id)?.tier ?? 0) === upgrade.tier - 1
              )
              const locked = !prevTierOwned && !owned

              return (
                <button
                  key={upgrade.id}
                  onClick={() => !owned && canAfford && !locked && onPurchase(upgrade)}
                  disabled={owned || !canAfford || locked}
                  className={cn(
                    "flex flex-col gap-2 rounded-xl border-2 p-3 text-left transition-all",
                    TIER_COLORS[upgrade.tier],
                    owned && "border-primary/40 bg-primary/10 opacity-80",
                    !owned && canAfford && !locked && "cursor-pointer hover:scale-[1.02] hover:shadow-md active:scale-[0.98]",
                    !owned && !canAfford && !locked && "opacity-50",
                    locked && "opacity-30"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        owned ? "bg-primary/20" : "bg-secondary"
                      )}>
                        {locked ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : owned ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Icon className="h-4 w-4 text-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground leading-tight">{upgrade.name}</p>
                        <p className="text-xs text-muted-foreground">{upgrade.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary">
                      +{upgrade.boost} {upgrade.stat}
                    </span>
                    {owned ? (
                      <span className="text-xs font-bold text-primary">Owned</span>
                    ) : (
                      <span className={cn(
                        "flex items-center gap-1 text-xs font-bold",
                        canAfford ? "text-accent-foreground" : "text-muted-foreground"
                      )}>
                        <Coins className="h-3 w-3" />
                        {upgrade.cost}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
