# Cell Stage — Project Guide

## Overview
An idle/adventure browser game inspired by Spore's cell stage. You evolve a cell organism, upgrade it with biological parts, and send it into biome arenas to consume, fight, and collect loot. Built as a single-page Next.js app with no backend — all state lives in localStorage.

## Tech Stack
- **Framework:** Next.js 16 (App Router), TypeScript
- **Styling:** Tailwind CSS v4, custom retro CSS classes in `globals.css`
- **State:** `useState` + localStorage (no Redux/Zustand). Core game logic in `lib/game-state.ts`
- **Fonts:** Nunito (sans, body text), VT323 (mono, UI/stats/labels)
- **No backend, no database, no auth** — purely client-side game

## Architecture

### State (`lib/game-state.ts`)
All game types, constants, and pure functions live here. The main page holds `GameState` in `useState` and passes slices + callbacks to child components. No reducers — direct `setState` calls with functional updates.

### Components
| File | Purpose |
|---|---|
| `app/page.tsx` | Main game shell — state, tabs, adventure timer, idle tick, offline earnings |
| `components/robot-avatar.tsx` | Cell SVG with visual evolution (upgrades appear on the cell) |
| `components/robot-status.tsx` | Left panel: cell name, color/appendage pickers, XP bar, stats, currencies |
| `components/adventure-panel.tsx` | Biome selector + arena view during adventures |
| `components/arena-view.tsx` | Canvas 2D auto-moving arena — cell hunts food, fights enemies, collects loot |
| `components/upgrade-shop.tsx` | Evolution Lab — buy biological upgrades with nutrients/biomass/fragments |
| `components/adventure-log.tsx` | Scrollable expedition history |
| `components/level-up-toast.tsx` | Mutation level-up overlay |
| `components/primordial-soup.tsx` | Animated canvas background with debris/particles |

### Visual Style
- **Era:** 2005-2010 Flash game aesthetic
- **Palette:** Near-black swamp tones (#060d10 bg), muted greens, rusty golds, dried-blood reds
- **CSS classes:** `.retro-panel`, `.retro-panel-header`, `.retro-btn`, `.retro-btn-gold`, `.retro-bar`, `.retro-bar-fill`
- **Effects:** CRT scanlines (`.retro-scanlines`), vignette (`.retro-vignette`)
- **Tone:** Gritty, visceral, biological. Not cute. Upgrades "rip," "dissolve," "fuse."

### Key Colors
| Token | Hex | Use |
|---|---|---|
| Primary (green) | `#44aa44` | XP, success, positive |
| Accent (gold) | `#c89030` | Nutrients, headers, warnings |
| Destructive (red) | `#aa3030` | Damage, toxicity, danger |
| Info (blue) | `#3080a0` | Membrane, defense |
| Rare (purple) | `#884488` | Biomass, mutations |
| Muted text | `#4a6058` | Labels, secondary info |
| Panel bg | `#0e1a1e` | Card backgrounds |
| Deep bg | `#040808` | Input/bar backgrounds |

## Conventions
- No emojis in code or UI
- All game text uses gritty biological tone
- Font sizes: `text-sm` minimum for readability, `font-mono` for stats/numbers
- New CSS goes in `globals.css` retro section, not inline
- Upgrades have `visualKey` that maps to SVG visual changes on the cell
- Currencies: nutrients (common), biomass (rare from adventures), mutation fragments (from arena loot)

## Commands
```bash
pnpm dev     # Start dev server
pnpm build   # Production build
pnpm lint    # ESLint
```
