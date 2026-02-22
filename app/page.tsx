"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  type GameState,
  type AdventureZone,
  type Upgrade,
  createInitialState,
  resolveAdventure,
  calculateXpToNext,
} from "@/lib/game-state"
import { RobotStatus } from "@/components/robot-status"
import { UpgradeShop } from "@/components/upgrade-shop"
import { AdventurePanel } from "@/components/adventure-panel"
import { AdventureLogView } from "@/components/adventure-log"
import { LevelUpToast } from "@/components/level-up-toast"
import { cn } from "@/lib/utils"
import { Wrench, Map, ScrollText, Bot } from "lucide-react"

type Tab = "upgrades" | "adventure" | "log"

export default function RobotAdventureGame() {
  const [state, setState] = useState<GameState>(createInitialState)
  const [activeTab, setActiveTab] = useState<Tab>("adventure")
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpLevel, setLevelUpLevel] = useState(1)
  const adventureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (adventureTimerRef.current) clearTimeout(adventureTimerRef.current)
    }
  }, [])

  const processLevelUp = useCallback((currentState: GameState): GameState => {
    let newState = { ...currentState }
    while (newState.xp >= newState.xpToNext) {
      newState.xp -= newState.xpToNext
      newState.level += 1
      newState.xpToNext = calculateXpToNext(newState.level)
      // Small stat boost on level up
      newState.stats = {
        attack: newState.stats.attack + 1,
        defense: newState.stats.defense + 1,
        speed: newState.stats.speed + 1,
        luck: newState.stats.luck + (newState.level % 3 === 0 ? 1 : 0),
      }
      setLevelUpLevel(newState.level)
      setShowLevelUp(true)
    }
    return newState
  }, [])

  const handleAdventure = useCallback(
    (zone: AdventureZone) => {
      // Speed reduction based on robot speed
      const speedReduction = Math.max(0.4, 1 - state.stats.speed * 0.01)
      const duration = Math.ceil(zone.baseDuration * speedReduction * 1000)

      setState((prev) => ({
        ...prev,
        isAdventuring: true,
        adventureEndTime: Date.now() + duration,
        currentZone: zone,
      }))

      adventureTimerRef.current = setTimeout(() => {
        setState((prev) => {
          const log = resolveAdventure(prev, zone)
          let updated: GameState = {
            ...prev,
            isAdventuring: false,
            adventureEndTime: null,
            currentZone: null,
            xp: prev.xp + log.xpGained,
            coins: prev.coins + log.coinsGained,
            adventureLog: [...prev.adventureLog, log],
            totalAdventures: prev.totalAdventures + 1,
            totalVictories: prev.totalVictories + (log.result === "victory" || log.result === "treasure" ? 1 : 0),
          }
          updated = processLevelUp(updated)
          return updated
        })
      }, duration)
    },
    [state.stats.speed, processLevelUp]
  )

  const handlePurchase = useCallback((upgrade: Upgrade) => {
    setState((prev) => {
      if (prev.coins < upgrade.cost || prev.upgrades.includes(upgrade.id)) return prev
      return {
        ...prev,
        coins: prev.coins - upgrade.cost,
        upgrades: [...prev.upgrades, upgrade.id],
        stats: {
          ...prev.stats,
          [upgrade.stat]: prev.stats[upgrade.stat] + upgrade.boost,
        },
      }
    })
  }, [])

  const handleChangeName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, robotName: name }))
  }, [])

  const handleChangeColor = useCallback((index: number) => {
    setState((prev) => ({ ...prev, colorIndex: index }))
  }, [])

  const handleChangeHat = useCallback((index: number) => {
    setState((prev) => ({ ...prev, hatIndex: index }))
  }, [])

  const tabs: { id: Tab; label: string; icon: typeof Wrench }[] = [
    { id: "adventure", label: "Adventure", icon: Map },
    { id: "upgrades", label: "Upgrades", icon: Wrench },
    { id: "log", label: "Log", icon: ScrollText },
  ]

  return (
    <main className="relative min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
          <Bot className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Robot Adventure</h1>
          <span className="ml-auto rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Lvl {state.level}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left panel - Robot status */}
          <aside className="w-full lg:w-80 lg:shrink-0">
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-5">
              <RobotStatus
                state={state}
                onChangeName={handleChangeName}
                onChangeColor={handleChangeColor}
                onChangeHat={handleChangeHat}
              />
            </div>
          </aside>

          {/* Right panel - Tabs */}
          <div className="flex-1">
            {/* Tab bar */}
            <div className="mb-4 flex gap-1 rounded-xl bg-secondary p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all",
                      activeTab === tab.id
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Tab content */}
            <div className="rounded-2xl border border-border bg-card p-5">
              {activeTab === "adventure" && (
                <AdventurePanel state={state} onAdventure={handleAdventure} />
              )}
              {activeTab === "upgrades" && (
                <UpgradeShop state={state} onPurchase={handlePurchase} />
              )}
              {activeTab === "log" && (
                <AdventureLogView logs={state.adventureLog} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Level up toast */}
      <LevelUpToast
        level={levelUpLevel}
        show={showLevelUp}
        onDone={() => setShowLevelUp(false)}
      />
    </main>
  )
}
