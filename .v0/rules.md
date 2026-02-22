# v0 Rules — Cell Stage Game

## Project
Idle/adventure browser game inspired by Spore cell stage. Evolve a cell, upgrade with biological parts, explore biome arenas to collect loot and level up.

## Stack
- Next.js 16, TypeScript, Tailwind v4, no backend
- All state in `lib/game-state.ts` via useState + localStorage
- Fonts: Nunito (sans), VT323 (mono)

## Visual Rules
- 2005-2010 Flash game era: dark swamp palette, beveled panels, CRT scanlines, vignette
- Use `.retro-panel`, `.retro-btn`, `.retro-bar` CSS classes from globals.css
- No emojis. Gritty biological tone — things "rip," "dissolve," "fuse," "writhe"
- Minimum font size: text-sm. Use font-mono for all stats/numbers/labels
- Colors: #44aa44 (green/success), #c89030 (gold/nutrients), #aa3030 (red/damage), #3080a0 (blue/defense), #884488 (purple/biomass)

## Architecture
- `lib/game-state.ts` — types, constants, pure helper functions
- `app/page.tsx` — main game shell with state, timers, tab routing
- Components receive state slices + callbacks, no internal state management for game data
- Arena is a canvas component that auto-moves the cell and spawns entities
- Upgrades have `visualKey` that maps to SVG visual changes on the cell in robot-avatar.tsx

## Currencies
- **Nutrients** — primary, earned passively + from adventures
- **Biomass** — rare, from adventure completion rewards
- **Mutation Fragments** — from arena loot drops, used to discount Evolution Lab upgrades
