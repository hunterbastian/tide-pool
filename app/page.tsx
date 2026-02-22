"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  type GameState,
  type Biome,
  type Upgrade,
  UPGRADES,
  IDLE_UPGRADES,
  createInitialState,
  resolveAdventure,
  calculateXpToNext,
  calculateNutrientsPerSec,
  calculateOfflineEarnings,
} from "@/lib/game-state"
import { RobotStatus } from "@/components/robot-status"
import { UpgradeShop } from "@/components/upgrade-shop"
import { AdventurePanel } from "@/components/adventure-panel"
import { AdventureLogView } from "@/components/adventure-log"
import { LevelUpToast } from "@/components/level-up-toast"
import { PrimordialSoup } from "@/components/primordial-soup"
import { Wrench, Map, ScrollText, FlaskConical } from "lucide-react"

type Tab = "adventure" | "upgrades" | "log"

const SAVE_KEY = "cell-stage-save"

export default function CellStageGame() {
  const [state, setState] = useState<GameState | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("adventure")
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpLevel, setLevelUpLevel] = useState(1)
  const [offlineMessage, setOfflineMessage] = useState<string | null>(null)
  const adventureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleTickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load saved game + calculate offline earnings
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY)
    if (saved) {
      try {
        const parsed: GameState = JSON.parse(saved)
        const { nutrients, elapsed } = calculateOfflineEarnings(parsed)
        if (elapsed > 10 && nutrients > 0) {
          setOfflineMessage(`Welcome back! You collected ${nutrients} nutrients while away (${Math.floor(elapsed / 60)}m).`)
          parsed.nutrients += nutrients
        }
        parsed.lastTickTime = Date.now()
        parsed.nutrientsPerSec = calculateNutrientsPerSec(parsed.upgrades)
        // Clear stale adventure
        if (parsed.isAdventuring && parsed.adventureEndTime && parsed.adventureEndTime < Date.now()) {
          parsed.isAdventuring = false
          parsed.adventureEndTime = null
          parsed.currentBiome = null
        }
        setState(parsed)
      } catch {
        setState(createInitialState())
      }
    } else {
      setState(createInitialState())
    }
  }, [])

  // Auto-save every 5s
  useEffect(() => {
    if (!state) return
    const timer = setTimeout(() => {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state))
    }, 5000)
    return () => clearTimeout(timer)
  }, [state])

  // Idle nutrient tick (every 1s)
  useEffect(() => {
    if (!state) return
    idleTickRef.current = setInterval(() => {
      setState((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          nutrients: prev.nutrients + prev.nutrientsPerSec,
          lastTickTime: Date.now(),
        }
      })
    }, 1000)
    return () => {
      if (idleTickRef.current) clearInterval(idleTickRef.current)
    }
  }, [state?.nutrientsPerSec]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup adventure timer
  useEffect(() => {
    return () => {
      if (adventureTimerRef.current) clearTimeout(adventureTimerRef.current)
    }
  }, [])

  // Dismiss offline message after 5s
  useEffect(() => {
    if (offlineMessage) {
      const t = setTimeout(() => setOfflineMessage(null), 5000)
      return () => clearTimeout(t)
    }
  }, [offlineMessage])

  const processLevelUp = useCallback((currentState: GameState): GameState => {
    let s = { ...currentState }
    while (s.xp >= s.xpToNext) {
      s.xp -= s.xpToNext
      s.level += 1
      s.xpToNext = calculateXpToNext(s.level)
      s.stats = {
        toxicity: s.stats.toxicity + 1,
        membrane: s.stats.membrane + 1,
        motility: s.stats.motility + 1,
        adaptation: s.stats.adaptation + (s.level % 3 === 0 ? 1 : 0),
      }
      setLevelUpLevel(s.level)
      setShowLevelUp(true)
    }
    return s
  }, [])

  const handleAdventure = useCallback(
    (biome: Biome) => {
      if (!state) return
      const speedReduction = Math.max(0.4, 1 - state.stats.motility * 0.01)
      const duration = Math.ceil(biome.baseDuration * speedReduction * 1000)

      setState((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          isAdventuring: true,
          adventureEndTime: Date.now() + duration,
          currentBiome: biome,
        }
      })

      adventureTimerRef.current = setTimeout(() => {
        setState((prev) => {
          if (!prev) return prev
          const log = resolveAdventure(prev, biome)
          let updated: GameState = {
            ...prev,
            isAdventuring: false,
            adventureEndTime: null,
            currentBiome: null,
            xp: prev.xp + log.xpGained,
            nutrients: prev.nutrients + log.nutrientsGained,
            biomass: prev.biomass + log.biomassGained,
            adventureLog: [...prev.adventureLog, log],
            totalAdventures: prev.totalAdventures + 1,
            totalDevours: prev.totalDevours + (log.result === "devour" || log.result === "discovery" ? 1 : 0),
          }
          updated = processLevelUp(updated)
          return updated
        })
      }, duration)
    },
    [state?.stats.motility, processLevelUp] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const handlePurchase = useCallback((upgrade: Upgrade) => {
    setState((prev) => {
      if (!prev) return prev
      if (prev.upgrades.includes(upgrade.id)) return prev

      const currency = upgrade.currency === "biomass" ? "biomass" : "nutrients"
      if (prev[currency] < upgrade.cost) return prev

      const allUpgrades = [...UPGRADES, ...IDLE_UPGRADES]
      const isIdleUpgrade = IDLE_UPGRADES.some((u) => u.id === upgrade.id)

      const newUpgrades = [...prev.upgrades, upgrade.id]
      const newNutrientsPerSec = calculateNutrientsPerSec(newUpgrades)

      return {
        ...prev,
        [currency]: prev[currency] - upgrade.cost,
        upgrades: newUpgrades,
        stats: isIdleUpgrade
          ? prev.stats
          : {
              ...prev.stats,
              [upgrade.stat]: prev.stats[upgrade.stat] + upgrade.boost,
            },
        nutrientsPerSec: newNutrientsPerSec,
      }
    })
  }, [])

  const handleChangeName = useCallback((name: string) => {
    setState((prev) => (prev ? { ...prev, cellName: name } : prev))
  }, [])
  const handleChangeColor = useCallback((index: number) => {
    setState((prev) => (prev ? { ...prev, colorIndex: index } : prev))
  }, [])
  const handleChangeHat = useCallback((index: number) => {
    setState((prev) => (prev ? { ...prev, hatIndex: index } : prev))
  }, [])

  if (!state) return null

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "adventure", label: "Explore", icon: Map },
    { id: "upgrades", label: "Evolve", icon: Wrench },
    { id: "log", label: "Log", icon: ScrollText },
  ]

  return (
    <main className="retro-scanlines retro-vignette relative min-h-screen overflow-hidden" style={{ background: "#060d10" }}>
      <PrimordialSoup />

      {/* Header bar */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "linear-gradient(180deg, #0e1a1e 0%, #080f12 100%)",
          borderBottom: "2px solid #1e3028",
          boxShadow: "0 2px 12px rgba(0,0,0,0.8)",
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-2.5 px-4 py-2">
          <FlaskConical className="h-5 w-5" style={{ color: "#44aa44" }} />
          <h1
            className="font-mono text-sm font-bold uppercase tracking-widest"
            style={{ color: "#c89030", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
          >
            Cell Stage
          </h1>
          <span className="ml-auto font-mono text-[11px]" style={{ color: "#4a6058" }}>
            LVL {state.level}
          </span>
          <div className="w-px h-4" style={{ background: "#1e3028" }} />
          <span className="font-mono text-[11px]" style={{ color: "#c89030" }}>
            {Math.floor(state.nutrients)} NUT
          </span>
          <span className="font-mono text-[11px]" style={{ color: "#884488" }}>
            {state.biomass} BM
          </span>
        </div>
      </header>

      {/* Offline earnings banner */}
      {offlineMessage && (
        <div
          className="relative z-30 text-center py-2 text-xs font-mono font-bold cursor-pointer"
          style={{
            background: "linear-gradient(90deg, #0e1a12, #081210, #0e1a12)",
            color: "#44aa44",
            borderBottom: "1px solid #1a3020",
          }}
          onClick={() => setOfflineMessage(null)}
        >
          {offlineMessage}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Left panel - Cell status */}
          <aside className="w-full lg:w-72 lg:shrink-0">
            <div className="retro-panel sticky top-16 p-4">
              <RobotStatus
                state={state}
                onChangeName={handleChangeName}
                onChangeColor={handleChangeColor}
                onChangeHat={handleChangeHat}
              />
            </div>
          </aside>

          {/* Right panel */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Tab bar */}
            <div
              className="flex gap-0.5 p-0.5"
              style={{ background: "#040808", border: "2px solid #1a2820", borderRadius: "2px" }}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-bold uppercase tracking-widest transition-all"
                    style={{
                      background: active
                        ? "linear-gradient(180deg, #142420, #0e1a1e)"
                        : "transparent",
                      color: active ? "#c89030" : "#2a3a32",
                      textShadow: active ? "0 1px 3px rgba(0,0,0,0.8)" : "none",
                      borderBottom: active ? "1px solid #1e3028" : "1px solid transparent",
                      borderRadius: "2px",
                    }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Tab content */}
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

      {/* Level up toast */}
      <LevelUpToast
        level={levelUpLevel}
        show={showLevelUp}
        onDone={() => setShowLevelUp(false)}
      />
    </main>
  )
}
