export interface RobotStats {
  attack: number
  defense: number
  speed: number
  luck: number
}

export interface Upgrade {
  id: string
  name: string
  description: string
  cost: number
  stat: keyof RobotStats
  boost: number
  icon: string
  tier: number
}

export interface AdventureZone {
  id: string
  name: string
  description: string
  requiredLevel: number
  baseDuration: number // in seconds
  baseReward: { xp: number; coins: number }
  dangerLevel: number
  emoji: string
}

export interface AdventureLog {
  id: string
  zone: AdventureZone
  result: "victory" | "defeat" | "treasure" | "event"
  message: string
  xpGained: number
  coinsGained: number
  timestamp: number
}

export interface GameState {
  robotName: string
  level: number
  xp: number
  xpToNext: number
  coins: number
  stats: RobotStats
  upgrades: string[] // purchased upgrade IDs
  adventureLog: AdventureLog[]
  isAdventuring: boolean
  adventureEndTime: number | null
  currentZone: AdventureZone | null
  totalAdventures: number
  totalVictories: number
  hatIndex: number
  colorIndex: number
}

export const UPGRADES: Upgrade[] = [
  { id: "blade-1", name: "Tiny Sword", description: "A cute little blade for your robot", cost: 10, stat: "attack", boost: 2, icon: "sword", tier: 1 },
  { id: "blade-2", name: "Laser Sword", description: "Pew pew goes the blade!", cost: 50, stat: "attack", boost: 5, icon: "sword", tier: 2 },
  { id: "blade-3", name: "Mega Cannon", description: "The ultimate firepower", cost: 200, stat: "attack", boost: 12, icon: "sword", tier: 3 },
  { id: "shield-1", name: "Tin Shield", description: "A dented but lovable shield", cost: 10, stat: "defense", boost: 2, icon: "shield", tier: 1 },
  { id: "shield-2", name: "Energy Barrier", description: "Deflects most attacks", cost: 50, stat: "defense", boost: 5, icon: "shield", tier: 2 },
  { id: "shield-3", name: "Fortress Armor", description: "Nearly impenetrable!", cost: 200, stat: "defense", boost: 12, icon: "shield", tier: 3 },
  { id: "boots-1", name: "Roller Wheels", description: "Zoom zoom!", cost: 10, stat: "speed", boost: 2, icon: "boots", tier: 1 },
  { id: "boots-2", name: "Jet Boosters", description: "Now we're flying!", cost: 50, stat: "speed", boost: 5, icon: "boots", tier: 2 },
  { id: "boots-3", name: "Warp Drive", description: "Faster than light!", cost: 200, stat: "speed", boost: 12, icon: "boots", tier: 3 },
  { id: "charm-1", name: "Lucky Bolt", description: "A shiny lucky charm", cost: 15, stat: "luck", boost: 2, icon: "clover", tier: 1 },
  { id: "charm-2", name: "Fortune Chip", description: "The odds favor you", cost: 60, stat: "luck", boost: 5, icon: "clover", tier: 2 },
  { id: "charm-3", name: "Destiny Core", description: "Fate itself bends to your will", cost: 250, stat: "luck", boost: 12, icon: "clover", tier: 3 },
]

export const ADVENTURE_ZONES: AdventureZone[] = [
  { id: "garden", name: "Robo Garden", description: "A peaceful garden full of friendly bugs and flowers", requiredLevel: 1, baseDuration: 8, baseReward: { xp: 15, coins: 8 }, dangerLevel: 1, emoji: "garden" },
  { id: "junkyard", name: "Scrap Yard", description: "Piles of scrap metal and hidden treasures", requiredLevel: 3, baseDuration: 12, baseReward: { xp: 30, coins: 15 }, dangerLevel: 2, emoji: "junkyard" },
  { id: "forest", name: "Pixel Forest", description: "A dense forest of digital trees and mushrooms", requiredLevel: 5, baseDuration: 15, baseReward: { xp: 50, coins: 25 }, dangerLevel: 3, emoji: "forest" },
  { id: "cave", name: "Crystal Caves", description: "Glittering caverns full of surprises", requiredLevel: 8, baseDuration: 20, baseReward: { xp: 80, coins: 40 }, dangerLevel: 4, emoji: "cave" },
  { id: "volcano", name: "Lava Mountain", description: "Only the bravest robots dare venture here!", requiredLevel: 12, baseDuration: 25, baseReward: { xp: 120, coins: 60 }, dangerLevel: 5, emoji: "volcano" },
  { id: "space", name: "Outer Space", description: "The final frontier for robot adventurers!", requiredLevel: 16, baseDuration: 30, baseReward: { xp: 200, coins: 100 }, dangerLevel: 6, emoji: "space" },
]

const ADVENTURE_EVENTS = {
  victory: [
    "battled a wild glitch-bug and won!",
    "defeated a rogue circuit board!",
    "outsmarted a maze of laser beams!",
    "vanquished a corrupted data monster!",
    "bravely fought off a swarm of nano-bots!",
    "crushed a challenging boss with style!",
  ],
  treasure: [
    "found a hidden stash of golden bolts!",
    "discovered a rare crystal chip!",
    "stumbled upon an ancient tech cache!",
    "unearthed a buried treasure chest!",
  ],
  event: [
    "made friends with a baby drone!",
    "helped a lost robot find its way home!",
    "discovered a mysterious glowing artifact!",
    "learned a new dance from friendly locals!",
    "found a beautiful vista and took a selfie!",
  ],
  defeat: [
    "got bonked by a falling gear...",
    "slipped on an oil puddle...",
    "ran into a wall and got dazed...",
    "was outsmarted by a tricky puzzle...",
  ],
}

export function calculateXpToNext(level: number): number {
  return Math.floor(50 * Math.pow(1.3, level - 1))
}

export function getTotalPower(stats: RobotStats): number {
  return stats.attack + stats.defense + stats.speed + stats.luck
}

export function resolveAdventure(state: GameState, zone: AdventureZone): AdventureLog {
  const power = getTotalPower(state.stats)
  const powerRatio = power / (zone.dangerLevel * 10)
  const luckBonus = state.stats.luck * 0.02

  const roll = Math.random() + luckBonus
  const successChance = Math.min(0.9, 0.3 + powerRatio * 0.15)

  let result: AdventureLog["result"]
  let xpMult = 1
  let coinMult = 1

  if (roll > 0.85) {
    result = "treasure"
    xpMult = 1.5
    coinMult = 2.5
  } else if (roll > successChance * 0.3) {
    if (Math.random() < 0.3) {
      result = "event"
      xpMult = 0.8
      coinMult = 0.5
    } else {
      result = "victory"
      xpMult = 1
      coinMult = 1
    }
  } else {
    result = "defeat"
    xpMult = 0.3
    coinMult = 0.1
  }

  const events = ADVENTURE_EVENTS[result]
  const message = events[Math.floor(Math.random() * events.length)]

  const speedBonus = 1 + state.stats.speed * 0.01
  const xpGained = Math.floor(zone.baseReward.xp * xpMult * speedBonus)
  const coinsGained = Math.floor(zone.baseReward.coins * coinMult)

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    zone,
    result,
    message,
    xpGained,
    coinsGained,
    timestamp: Date.now(),
  }
}

export function createInitialState(): GameState {
  return {
    robotName: "Sparky",
    level: 1,
    xp: 0,
    xpToNext: calculateXpToNext(1),
    coins: 25,
    stats: { attack: 3, defense: 3, speed: 3, luck: 2 },
    upgrades: [],
    adventureLog: [],
    isAdventuring: false,
    adventureEndTime: null,
    currentZone: null,
    totalAdventures: 0,
    totalVictories: 0,
    hatIndex: 0,
    colorIndex: 0,
  }
}
