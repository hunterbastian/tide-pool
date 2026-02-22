// ── Cell Stats ────────────────────────────────────────────────
export interface CellStats {
  toxicity: number   // attack equivalent — venom / damage output
  membrane: number   // defense equivalent — damage resistance
  motility: number   // speed equivalent — faster adventures, dodge chance
  adaptation: number // luck equivalent — crit chance, treasure find
}

// ── Upgrades (biological parts) ──────────────────────────────
export interface Upgrade {
  id: string
  name: string
  description: string
  cost: number
  currency: "nutrients" | "biomass"
  stat: keyof CellStats
  boost: number
  icon: string
  tier: number
  visualKey?: string // maps to a visual change on the cell SVG
}

// ── Adventure Biomes ─────────────────────────────────────────
export interface Biome {
  id: string
  name: string
  description: string
  requiredLevel: number
  baseDuration: number // seconds
  baseReward: { xp: number; nutrients: number; biomass: number }
  dangerLevel: number
  color: string
}

// ── Adventure Log ────────────────────────────────────────────
export interface AdventureLog {
  id: string
  biome: Biome
  result: "devour" | "flee" | "discovery" | "evolution"
  message: string
  xpGained: number
  nutrientsGained: number
  biomassGained: number
  timestamp: number
}

// ── Game State ───────────────────────────────────────────────
export interface GameState {
  cellName: string
  level: number
  xp: number
  xpToNext: number
  nutrients: number       // primary currency (coins)
  biomass: number         // premium currency from adventures
  stats: CellStats
  upgrades: string[]      // purchased upgrade IDs
  adventureLog: AdventureLog[]
  isAdventuring: boolean
  adventureEndTime: number | null
  currentBiome: Biome | null
  totalAdventures: number
  totalDevours: number
  hatIndex: number        // appendage index
  colorIndex: number
  nutrientsPerSec: number // idle income
  lastTickTime: number    // timestamp for offline earnings
}

// ── Upgrades ─────────────────────────────────────────────────
export const UPGRADES: Upgrade[] = [
  // Toxicity (attack)
  { id: "tox-1", name: "Stinger Cell",     description: "Develops basic nematocysts",         cost: 10,  currency: "nutrients", stat: "toxicity",   boost: 2,  icon: "syringe",  tier: 1, visualKey: "stinger" },
  { id: "tox-2", name: "Venom Sac",        description: "Secretes paralyzing enzymes",        cost: 50,  currency: "nutrients", stat: "toxicity",   boost: 5,  icon: "syringe",  tier: 2, visualKey: "venom" },
  { id: "tox-3", name: "Acid Spray",       description: "Dissolves prey on contact",          cost: 200, currency: "biomass",   stat: "toxicity",   boost: 12, icon: "syringe",  tier: 3, visualKey: "acid" },
  // Membrane (defense)
  { id: "mem-1", name: "Lipid Layer",      description: "Thickens the cell wall",             cost: 10,  currency: "nutrients", stat: "membrane",   boost: 2,  icon: "shield",   tier: 1, visualKey: "lipid" },
  { id: "mem-2", name: "Chitin Armor",     description: "Hard outer shell forms",             cost: 50,  currency: "nutrients", stat: "membrane",   boost: 5,  icon: "shield",   tier: 2, visualKey: "chitin" },
  { id: "mem-3", name: "Spore Casing",     description: "Near-indestructible capsule",        cost: 200, currency: "biomass",   stat: "membrane",   boost: 12, icon: "shield",   tier: 3, visualKey: "spore" },
  // Motility (speed)
  { id: "mot-1", name: "Cilia Band",       description: "Tiny hairs propel you faster",       cost: 10,  currency: "nutrients", stat: "motility",   boost: 2,  icon: "wind",     tier: 1, visualKey: "cilia" },
  { id: "mot-2", name: "Flagellum+",       description: "A powerful whip-tail",               cost: 50,  currency: "nutrients", stat: "motility",   boost: 5,  icon: "wind",     tier: 2, visualKey: "flagellum" },
  { id: "mot-3", name: "Jet Propulsion",   description: "Expels water at high velocity",      cost: 200, currency: "biomass",   stat: "motility",   boost: 12, icon: "wind",     tier: 3, visualKey: "jet" },
  // Adaptation (luck)
  { id: "ada-1", name: "Photoreceptor",    description: "Primitive light sensing",            cost: 15,  currency: "nutrients", stat: "adaptation", boost: 2,  icon: "eye",      tier: 1, visualKey: "photo" },
  { id: "ada-2", name: "Chemosensor",      description: "Detects nutrients from far away",    cost: 60,  currency: "nutrients", stat: "adaptation", boost: 5,  icon: "eye",      tier: 2, visualKey: "chemo" },
  { id: "ada-3", name: "Neural Cluster",   description: "Proto-brain emerges!",               cost: 250, currency: "biomass",   stat: "adaptation", boost: 12, icon: "eye",      tier: 3, visualKey: "neural" },
]

// ── Idle income upgrades (stacks with base) ──────────────────
export const IDLE_UPGRADES: Upgrade[] = [
  { id: "idle-1", name: "Chloroplast",     description: "Photosynthesis: +0.5 nutrients/sec", cost: 30,  currency: "nutrients", stat: "adaptation", boost: 0, icon: "leaf", tier: 1, visualKey: "chloro" },
  { id: "idle-2", name: "Mitochondria+",   description: "Powerhouse: +1.5 nutrients/sec",     cost: 120, currency: "nutrients", stat: "adaptation", boost: 0, icon: "zap",  tier: 2, visualKey: "mito" },
  { id: "idle-3", name: "Symbiote",        description: "Mutualism: +4 nutrients/sec",        cost: 400, currency: "biomass",   stat: "adaptation", boost: 0, icon: "heart",tier: 3, visualKey: "symbiote" },
]

export const IDLE_RATES = [0.5, 1.5, 4] // nutrients per sec per idle upgrade tier

// ── Biomes ───────────────────────────────────────────────────
export const BIOMES: Biome[] = [
  { id: "tidepool",    name: "Tide Pool",          description: "Warm, shallow water teeming with microbes",     requiredLevel: 1,  baseDuration: 8,  baseReward: { xp: 15, nutrients: 8,  biomass: 0 }, dangerLevel: 1, color: "#40c8e0" },
  { id: "kelp",        name: "Kelp Forest",        description: "Dense algae forests hide predators and prey",   requiredLevel: 3,  baseDuration: 12, baseReward: { xp: 30, nutrients: 15, biomass: 1 }, dangerLevel: 2, color: "#40b060" },
  { id: "coral",       name: "Coral Reef",         description: "Colorful and dangerous in equal measure",       requiredLevel: 5,  baseDuration: 15, baseReward: { xp: 50, nutrients: 25, biomass: 2 }, dangerLevel: 3, color: "#e07080" },
  { id: "vent",        name: "Hydrothermal Vent",  description: "Superheated water and exotic chemotrophs",      requiredLevel: 8,  baseDuration: 20, baseReward: { xp: 80, nutrients: 40, biomass: 4 }, dangerLevel: 4, color: "#e06030" },
  { id: "abyss",       name: "Abyssal Trench",     description: "Crushing pressure, bioluminescent horrors",     requiredLevel: 12, baseDuration: 25, baseReward: { xp: 120, nutrients: 60, biomass: 7 }, dangerLevel: 5, color: "#3040a0" },
  { id: "primordial",  name: "Primordial Core",    description: "The origin of all life... and death",           requiredLevel: 16, baseDuration: 30, baseReward: { xp: 200, nutrients: 100, biomass: 12 }, dangerLevel: 6, color: "#a030c0" },
]

// ── Adventure Events ─────────────────────────────────────────
const ADVENTURE_EVENTS = {
  devour: [
    "engulfed a rival microbe in one gulp!",
    "dissolved a bacterial colony with acid!",
    "caught a fleeing paramecium!",
    "ambushed prey hiding in the sediment!",
    "overpowered a competing organism!",
    "consumed a massive food particle!",
  ],
  discovery: [
    "found a cluster of amino acids!",
    "discovered a mineral-rich deposit!",
    "stumbled upon a nutrient geyser!",
    "located an ancient organic compound!",
  ],
  evolution: [
    "felt a strange mutation taking hold...",
    "absorbed foreign DNA and grew stronger!",
    "witnessed a fellow organism evolve!",
    "discovered a new survival strategy!",
    "adapted to the extreme conditions!",
  ],
  flee: [
    "was chased off by a larger predator...",
    "got caught in a toxic current...",
    "bumped into a sea urchin...",
    "was outmaneuvered by a faster organism...",
  ],
}

// ── Helpers ──────────────────────────────────────────────────
export function calculateXpToNext(level: number): number {
  return Math.floor(50 * Math.pow(1.3, level - 1))
}

export function getTotalPower(stats: CellStats): number {
  return stats.toxicity + stats.membrane + stats.motility + stats.adaptation
}

export function calculateNutrientsPerSec(upgrades: string[]): number {
  let rate = 0.1 // base passive income
  IDLE_UPGRADES.forEach((u, i) => {
    if (upgrades.includes(u.id)) rate += IDLE_RATES[i]
  })
  return rate
}

export function calculateOfflineEarnings(state: GameState): { nutrients: number; elapsed: number } {
  const now = Date.now()
  const elapsed = Math.min((now - state.lastTickTime) / 1000, 3600 * 4) // cap 4h offline
  const nutrients = Math.floor(state.nutrientsPerSec * elapsed)
  return { nutrients, elapsed }
}

export function resolveAdventure(state: GameState, biome: Biome): AdventureLog {
  const power = getTotalPower(state.stats)
  const powerRatio = power / (biome.dangerLevel * 10)
  const adaptBonus = state.stats.adaptation * 0.02

  const roll = Math.random() + adaptBonus
  const successChance = Math.min(0.9, 0.3 + powerRatio * 0.15)

  let result: AdventureLog["result"]
  let xpMult = 1
  let nutrientMult = 1
  let biomassMult = 1

  if (roll > 0.85) {
    result = "discovery"
    xpMult = 1.5
    nutrientMult = 2.5
    biomassMult = 2
  } else if (roll > successChance * 0.3) {
    if (Math.random() < 0.25) {
      result = "evolution"
      xpMult = 1.2
      nutrientMult = 0.5
      biomassMult = 3
    } else {
      result = "devour"
      xpMult = 1
      nutrientMult = 1
      biomassMult = 1
    }
  } else {
    result = "flee"
    xpMult = 0.3
    nutrientMult = 0.1
    biomassMult = 0
  }

  const events = ADVENTURE_EVENTS[result]
  const message = events[Math.floor(Math.random() * events.length)]

  const speedBonus = 1 + state.stats.motility * 0.01
  const xpGained = Math.floor(biome.baseReward.xp * xpMult * speedBonus)
  const nutrientsGained = Math.floor(biome.baseReward.nutrients * nutrientMult)
  const biomassGained = Math.floor(biome.baseReward.biomass * biomassMult)

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    biome,
    result,
    message,
    xpGained,
    nutrientsGained,
    biomassGained,
    timestamp: Date.now(),
  }
}

export function createInitialState(): GameState {
  return {
    cellName: "Blobby",
    level: 1,
    xp: 0,
    xpToNext: calculateXpToNext(1),
    nutrients: 25,
    biomass: 0,
    stats: { toxicity: 3, membrane: 3, motility: 3, adaptation: 2 },
    upgrades: [],
    adventureLog: [],
    isAdventuring: false,
    adventureEndTime: null,
    currentBiome: null,
    totalAdventures: 0,
    totalDevours: 0,
    hatIndex: 0,
    colorIndex: 0,
    nutrientsPerSec: 0.1,
    lastTickTime: Date.now(),
  }
}
