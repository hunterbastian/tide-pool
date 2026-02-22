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

// ── Arena Loot ───────────────────────────────────────────────
export type ArenaEntityType = "food" | "enemy" | "loot"
export type ArenaLootKind = "nutrient_glob" | "biomass_chunk" | "stat_shard" | "mutation_fragment" | "temp_buff"

export interface ArenaEvent {
  id: string
  type: "ate_food" | "killed_enemy" | "lost_fight" | "collected_loot"
  message: string
  nutrients?: number
  biomass?: number
  statBoost?: { stat: keyof CellStats; amount: number }
  fragments?: number
  tempBuff?: { stat: keyof CellStats; amount: number }
}

export interface ArenaLootDrop {
  kind: ArenaLootKind
  weight: number
  label: string
}

export const ARENA_LOOT_TABLE: ArenaLootDrop[] = [
  { kind: "nutrient_glob",      weight: 40, label: "Nutrient Glob" },
  { kind: "biomass_chunk",      weight: 15, label: "Biomass Chunk" },
  { kind: "stat_shard",         weight: 20, label: "Stat Shard" },
  { kind: "mutation_fragment",  weight: 15, label: "Mutation Fragment" },
  { kind: "temp_buff",          weight: 10, label: "Adrenaline Burst" },
]

const STAT_KEYS: (keyof CellStats)[] = ["toxicity", "membrane", "motility", "adaptation"]

export function rollArenaLoot(biome: Biome): { kind: ArenaLootKind; event: ArenaEvent } {
  const totalWeight = ARENA_LOOT_TABLE.reduce((s, l) => s + l.weight, 0)
  let roll = Math.random() * totalWeight
  let picked = ARENA_LOOT_TABLE[0]
  for (const entry of ARENA_LOOT_TABLE) {
    roll -= entry.weight
    if (roll <= 0) { picked = entry; break }
  }

  const stat = STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)]
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

  switch (picked.kind) {
    case "nutrient_glob": {
      const amt = 3 + Math.floor(Math.random() * 6 * biome.dangerLevel)
      return { kind: picked.kind, event: { id, type: "collected_loot", message: `Scooped up a nutrient glob! +${amt} nutrients.`, nutrients: amt } }
    }
    case "biomass_chunk": {
      const amt = 1 + Math.floor(Math.random() * biome.dangerLevel * 0.5)
      return { kind: picked.kind, event: { id, type: "collected_loot", message: `Found a chunky biomass deposit! +${amt} biomass.`, biomass: amt } }
    }
    case "stat_shard": {
      return { kind: picked.kind, event: { id, type: "collected_loot", message: `A glowing shard merged with you. +1 ${stat}!`, statBoost: { stat, amount: 1 } } }
    }
    case "mutation_fragment": {
      return { kind: picked.kind, event: { id, type: "collected_loot", message: `Found a shimmering mutation fragment! Full of potential.`, fragments: 1 } }
    }
    case "temp_buff": {
      return { kind: picked.kind, event: { id, type: "collected_loot", message: `Energy surge! +3 ${stat} for this run.`, tempBuff: { stat, amount: 3 } } }
    }
  }
}

export function rollArenaFight(stats: CellStats, biome: Biome): ArenaEvent {
  const power = stats.toxicity + stats.membrane
  const enemyPower = biome.dangerLevel * 5 + Math.random() * 5
  const won = power + Math.random() * 10 > enemyPower
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

  if (won) {
    const nut = 2 + Math.floor(Math.random() * 4 * biome.dangerLevel)
    return { id, type: "killed_enemy", message: `Won a scuffle! The rival swam away. +${nut} nutrients.`, nutrients: nut }
  } else {
    return { id, type: "lost_fight", message: `Bumped into something tough. Better retreat!` }
  }
}

export function rollArenaFood(biome: Biome): ArenaEvent {
  const nut = 1 + Math.floor(Math.random() * 3 * biome.dangerLevel)
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  return { id, type: "ate_food", message: `Nibbled on some drifting organic bits. +${nut} nutrients.`, nutrients: nut }
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
  mutationFragments: number // arena loot currency — discounts upgrades
  stats: CellStats
  upgrades: string[]      // purchased upgrade IDs
  adventureLog: AdventureLog[]
  arenaEvents: ArenaEvent[]  // real-time events during current arena run
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
  { id: "tox-1", name: "Tiny Stinger",     description: "A small barb that packs a surprising punch",  cost: 10,  currency: "nutrients", stat: "toxicity",   boost: 2,  icon: "syringe",  tier: 1, visualKey: "stinger" },
  { id: "tox-2", name: "Venom Sac",        description: "Produces a mild toxin that stuns rivals",     cost: 50,  currency: "nutrients", stat: "toxicity",   boost: 5,  icon: "syringe",  tier: 2, visualKey: "venom" },
  { id: "tox-3", name: "Acid Spray",       description: "A potent chemical defense. Very persuasive",  cost: 200, currency: "biomass",   stat: "toxicity",   boost: 12, icon: "syringe",  tier: 3, visualKey: "acid" },
  // Membrane (defense)
  { id: "mem-1", name: "Thick Skin",       description: "A sturdier outer layer for bumpy encounters", cost: 10,  currency: "nutrients", stat: "membrane",   boost: 2,  icon: "shield",   tier: 1, visualKey: "lipid" },
  { id: "mem-2", name: "Chitin Shell",     description: "Hard plates that make you extra crunchy",     cost: 50,  currency: "nutrients", stat: "membrane",   boost: 5,  icon: "shield",   tier: 2, visualKey: "chitin" },
  { id: "mem-3", name: "Spore Casing",     description: "An incredibly tough outer hull. Tank mode!",  cost: 200, currency: "biomass",   stat: "membrane",   boost: 12, icon: "shield",   tier: 3, visualKey: "spore" },
  // Motility (speed)
  { id: "mot-1", name: "Cilia Fringe",     description: "Tiny hairs that help you zip through water",  cost: 10,  currency: "nutrients", stat: "motility",   boost: 2,  icon: "wind",     tier: 1, visualKey: "cilia" },
  { id: "mot-2", name: "Flagellum",        description: "A whip-like tail for speedy propulsion",      cost: 50,  currency: "nutrients", stat: "motility",   boost: 5,  icon: "wind",     tier: 2, visualKey: "flagellum" },
  { id: "mot-3", name: "Jet Siphon",       description: "Squirts water for quick bursts of speed",     cost: 200, currency: "biomass",   stat: "motility",   boost: 12, icon: "wind",     tier: 3, visualKey: "jet" },
  // Adaptation (luck)
  { id: "ada-1", name: "Sense Organ",      description: "Basic heat-sensing spots along your body",    cost: 15,  currency: "nutrients", stat: "adaptation", boost: 2,  icon: "eye",      tier: 1, visualKey: "photo" },
  { id: "ada-2", name: "Chemoreceptor",    description: "Sniffs out tasty morsels from a distance",    cost: 60,  currency: "nutrients", stat: "adaptation", boost: 5,  icon: "eye",      tier: 2, visualKey: "chemo" },
  { id: "ada-3", name: "Proto-Brain",      description: "A tiny cluster of neurons. You feel smarter", cost: 250, currency: "biomass",   stat: "adaptation", boost: 12, icon: "eye",      tier: 3, visualKey: "neural" },
]

// ── Idle income upgrades (stacks with base) ──────────────────
export const IDLE_UPGRADES: Upgrade[] = [
  { id: "idle-1", name: "Borrowed Chloroplast", description: "A little green friend that makes energy: +0.5/s",  cost: 30,  currency: "nutrients", stat: "adaptation", boost: 0, icon: "leaf", tier: 1, visualKey: "chloro" },
  { id: "idle-2", name: "Super Mitochondria",  description: "The powerhouse upgrade. Extra juice: +1.5/s",     cost: 120, currency: "nutrients", stat: "adaptation", boost: 0, icon: "zap",  tier: 2, visualKey: "mito" },
  { id: "idle-3", name: "Symbiote Buddy",      description: "A friendly creature that shares nutrients: +4/s", cost: 400, currency: "biomass",   stat: "adaptation", boost: 0, icon: "heart",tier: 3, visualKey: "symbiote" },
]

export const IDLE_RATES = [0.5, 1.5, 4] // nutrients per sec per idle upgrade tier

// ── Biomes ───────────────────────────────────────────────────
export const BIOMES: Biome[] = [
  { id: "tidepool",    name: "Tide Pool",           description: "Warm, shallow water. Plenty of snacks floating around",     requiredLevel: 1,  baseDuration: 8,  baseReward: { xp: 15, nutrients: 8,  biomass: 0 }, dangerLevel: 1, color: "#4a9880" },
  { id: "kelp",        name: "Kelp Forest",         description: "Towering algae groves full of hidden treasures",            requiredLevel: 3,  baseDuration: 12, baseReward: { xp: 30, nutrients: 15, biomass: 1 }, dangerLevel: 2, color: "#5a8850" },
  { id: "coral",       name: "Coral Garden",        description: "Colorful reef structures. Watch out for territorial types", requiredLevel: 5,  baseDuration: 15, baseReward: { xp: 50, nutrients: 25, biomass: 2 }, dangerLevel: 3, color: "#c07068" },
  { id: "vent",        name: "Thermal Vent",        description: "Warm mineral-rich waters. Tricky but rewarding",            requiredLevel: 8,  baseDuration: 20, baseReward: { xp: 80, nutrients: 40, biomass: 4 }, dangerLevel: 4, color: "#c08838" },
  { id: "abyss",       name: "Deep Waters",         description: "Dark and mysterious. Big creatures roam down here",         requiredLevel: 12, baseDuration: 25, baseReward: { xp: 120, nutrients: 60, biomass: 7 }, dangerLevel: 5, color: "#4060a0" },
  { id: "primordial",  name: "The Origin",          description: "The ancient depths where life first sparked",               requiredLevel: 16, baseDuration: 30, baseReward: { xp: 200, nutrients: 100, biomass: 12 }, dangerLevel: 6, color: "#8850a0" },
]

// ── Adventure Events ─────────────────────────────────────────
const ADVENTURE_EVENTS = {
  devour: [
    "caught a smaller cell and gobbled it up. Tasty!",
    "found a cluster of bacteria and had a feast.",
    "chased down a slow-moving morsel. Nom nom!",
    "surprised something hiding in the sediment. Snack time!",
    "outswam a rival to the last food particle. Victory!",
    "swallowed a big food glob whole. So full!",
  ],
  discovery: [
    "found a cluster of amino acids drifting nearby. Score!",
    "discovered a mineral-rich spring bubbling from below.",
    "stumbled into a nutrient cloud. Ate until stuffed.",
    "located some ancient organic compounds. Interesting flavor.",
  ],
  evolution: [
    "something shifted inside you. A new trait is emerging...",
    "absorbed some unusual DNA. You feel... different.",
    "watched another organism evolve. Inspiring!",
    "survived a tough encounter and grew stronger.",
    "the pressure down here changed you. In a good way.",
  ],
  flee: [
    "something big swam by. Time to hide!",
    "drifted into an uncomfortable current. Retreated quickly.",
    "a bigger cell got a bit too close. You scooted away.",
    "outpaced by something faster. Better luck next time!",
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

// Fragment discount: 1 fragment = 10 nutrient discount or 3 biomass discount
export const FRAGMENT_NUTRIENT_VALUE = 10
export const FRAGMENT_BIOMASS_VALUE = 3

export function getFragmentDiscount(upgrade: Upgrade, fragments: number): { fragmentsUsed: number; discount: number } {
  const valuePerFragment = upgrade.currency === "biomass" ? FRAGMENT_BIOMASS_VALUE : FRAGMENT_NUTRIENT_VALUE
  const maxUseful = Math.ceil(upgrade.cost / valuePerFragment)
  const fragmentsUsed = Math.min(fragments, maxUseful)
  const discount = Math.min(upgrade.cost, fragmentsUsed * valuePerFragment)
  return { fragmentsUsed, discount }
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
    mutationFragments: 0,
    stats: { toxicity: 3, membrane: 3, motility: 3, adaptation: 2 },
    upgrades: [],
    adventureLog: [],
    arenaEvents: [],
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
