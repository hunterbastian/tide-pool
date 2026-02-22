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
  { id: "tox-1", name: "Barbed Stinger",   description: "Crude nematocysts that rip through tissue",  cost: 10,  currency: "nutrients", stat: "toxicity",   boost: 2,  icon: "syringe",  tier: 1, visualKey: "stinger" },
  { id: "tox-2", name: "Venom Gland",      description: "Secretes a paralytic that dissolves nerves", cost: 50,  currency: "nutrients", stat: "toxicity",   boost: 5,  icon: "syringe",  tier: 2, visualKey: "venom" },
  { id: "tox-3", name: "Corrosive Bile",   description: "Melts prey into soup on contact",            cost: 200, currency: "biomass",   stat: "toxicity",   boost: 12, icon: "syringe",  tier: 3, visualKey: "acid" },
  // Membrane (defense)
  { id: "mem-1", name: "Scar Tissue",      description: "Thickened membrane, harder to puncture",     cost: 10,  currency: "nutrients", stat: "membrane",   boost: 2,  icon: "shield",   tier: 1, visualKey: "lipid" },
  { id: "mem-2", name: "Chitin Plating",   description: "Calcified shell plates fused to your body",  cost: 50,  currency: "nutrients", stat: "membrane",   boost: 5,  icon: "shield",   tier: 2, visualKey: "chitin" },
  { id: "mem-3", name: "Bone Casing",      description: "Nearly indestructible ossified hull",         cost: 200, currency: "biomass",   stat: "membrane",   boost: 12, icon: "shield",   tier: 3, visualKey: "spore" },
  // Motility (speed)
  { id: "mot-1", name: "Cilia Fringe",     description: "Writhing hairs that claw through the murk",  cost: 10,  currency: "nutrients", stat: "motility",   boost: 2,  icon: "wind",     tier: 1, visualKey: "cilia" },
  { id: "mot-2", name: "Lash Flagellum",   description: "A whip-tail that propels you violently",     cost: 50,  currency: "nutrients", stat: "motility",   boost: 5,  icon: "wind",     tier: 2, visualKey: "flagellum" },
  { id: "mot-3", name: "Jet Siphon",       description: "Expels pressurized fluid for burst speed",   cost: 200, currency: "biomass",   stat: "motility",   boost: 12, icon: "wind",     tier: 3, visualKey: "jet" },
  // Adaptation (luck)
  { id: "ada-1", name: "Pit Organ",        description: "Crude heat-sensing pits along the membrane", cost: 15,  currency: "nutrients", stat: "adaptation", boost: 2,  icon: "eye",      tier: 1, visualKey: "photo" },
  { id: "ada-2", name: "Chemoreceptor",    description: "Tastes blood in the water from afar",        cost: 60,  currency: "nutrients", stat: "adaptation", boost: 5,  icon: "eye",      tier: 2, visualKey: "chemo" },
  { id: "ada-3", name: "Nerve Knot",       description: "A proto-brain writhes into existence",       cost: 250, currency: "biomass",   stat: "adaptation", boost: 12, icon: "eye",      tier: 3, visualKey: "neural" },
]

// ── Idle income upgrades (stacks with base) ──────────────────
export const IDLE_UPGRADES: Upgrade[] = [
  { id: "idle-1", name: "Stolen Chloroplast",  description: "Ripped from a dead alga. Leaks energy: +0.5/s",   cost: 30,  currency: "nutrients", stat: "adaptation", boost: 0, icon: "leaf", tier: 1, visualKey: "chloro" },
  { id: "idle-2", name: "Bloated Mito",       description: "Overgrown powerhouse. Burns hot: +1.5/s",       cost: 120, currency: "nutrients", stat: "adaptation", boost: 0, icon: "zap",  tier: 2, visualKey: "mito" },
  { id: "idle-3", name: "Parasite Bond",      description: "A creature fused to you. Feeds you both: +4/s", cost: 400, currency: "biomass",   stat: "adaptation", boost: 0, icon: "heart",tier: 3, visualKey: "symbiote" },
]

export const IDLE_RATES = [0.5, 1.5, 4] // nutrients per sec per idle upgrade tier

// ── Biomes ───────────────────────────────────────────────────
export const BIOMES: Biome[] = [
  { id: "tidepool",    name: "Stagnant Pool",      description: "Warm, fetid water. Easy prey rots in the shallows",    requiredLevel: 1,  baseDuration: 8,  baseReward: { xp: 15, nutrients: 8,  biomass: 0 }, dangerLevel: 1, color: "#3a8868" },
  { id: "kelp",        name: "Rotting Kelp Bed",   description: "Decomposing algae forests. Predators lurk within",  requiredLevel: 3,  baseDuration: 12, baseReward: { xp: 30, nutrients: 15, biomass: 1 }, dangerLevel: 2, color: "#4a7040" },
  { id: "coral",       name: "Bone Reef",          description: "Calcified remains of dead colonies. Toxic and sharp",  requiredLevel: 5,  baseDuration: 15, baseReward: { xp: 50, nutrients: 25, biomass: 2 }, dangerLevel: 3, color: "#8a5050" },
  { id: "vent",        name: "Sulfur Vent",        description: "Scalding, poisonous water. Only the adapted survive", requiredLevel: 8,  baseDuration: 20, baseReward: { xp: 80, nutrients: 40, biomass: 4 }, dangerLevel: 4, color: "#a06820" },
  { id: "abyss",       name: "Crush Depth",        description: "Lightless void. Pressure warps flesh. Things hunt here", requiredLevel: 12, baseDuration: 25, baseReward: { xp: 120, nutrients: 60, biomass: 7 }, dangerLevel: 5, color: "#2a3060" },
  { id: "primordial",  name: "The Maw",            description: "Where it all began. Where most things end",            requiredLevel: 16, baseDuration: 30, baseReward: { xp: 200, nutrients: 100, biomass: 12 }, dangerLevel: 6, color: "#602040" },
]

// ── Adventure Events ─────────────────────────────────────────
const ADVENTURE_EVENTS = {
  devour: [
    "tore a rival apart membrane-first.",
    "dissolved a bacterial colony. Nothing remained.",
    "cornered a fleeing paramecium. It didn't escape.",
    "ambushed something hiding in the sediment. It screamed chemically.",
    "crushed a competitor. Absorbed its nutrients while it was still alive.",
    "swallowed a massive food particle whole. Your body distended.",
  ],
  discovery: [
    "found a rotting cluster of amino acids. Still useful.",
    "discovered a mineral-rich deposit leaking from cracked rock.",
    "stumbled into a nutrient geyser. Gorged until bloated.",
    "located ancient organic compounds sealed in dead tissue.",
  ],
  evolution: [
    "something shifted inside you. A mutation took root...",
    "absorbed foreign DNA from a corpse. You feel... different.",
    "watched a fellow organism split and change. You understood.",
    "survived something that should have killed you. You adapted.",
    "the environment broke you. You rebuilt yourself stronger.",
  ],
  flee: [
    "something massive moved in the dark. You fled.",
    "caught in a toxic plume. Membrane blistering. Retreated.",
    "a predator's tendrils grazed you. You barely escaped.",
    "outmaneuvered by something faster. It let you go. This time.",
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
