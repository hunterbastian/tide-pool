Original prompt: audit this game and give me link to play

- Loaded develop-web-game skill and reviewed single-file game implementation in index.html.
- Planned audit: run local server, execute Playwright action bursts, inspect screenshots/render state, and capture console/runtime issues.

## Audit run (2026-02-19)
- Started local server: `python3 -m http.server 4173` from project root.
- Ran Playwright client against `http://127.0.0.1:4173` with start-button click and 4 iterations.
- Generated screenshots: `output/web-game/shot-0.png` ... `shot-3.png`.
- Interactive browser pass confirmed pause/resume (Escape) and score progression.

### Findings
1. Missing `window.render_game_to_text` and `window.advanceTime` hooks (testability + deterministic automation gap).
2. Front-appendage draw condition uses an always-true guard, so front appendages never render.
3. Missing `/favicon.ico` produces a startup console error.

### TODO suggestions
- Add `render_game_to_text` and deterministic `advanceTime(ms)` hooks.
- Fix front-appendage condition in `drawCell`.
- Add favicon asset or remove favicon request.

## Follow-up request (2026-02-19): add physics and more minimal models
- Implemented minimal visual models for cells and food (simple circles + directional eye).
- Added physics primitives: mass-based forces (`applyForce`), damping, restitution, pairwise collision separation and impulse response.
- Replaced variable-step gameplay loop with fixed-step simulation (`PHYSICS_DT`) and capped frame catch-up.
- Added deterministic automation hooks: `window.advanceTime(ms)` and `window.render_game_to_text()`.
- Added inline favicon data URL to remove startup 404 error.

### Verification
- Syntax check passed (`node --check` on extracted script).
- Playwright game client run generated screenshots and states for 6 iterations.
- Manual browser validation confirmed hooks are functions and error console is clean.

## Follow-up request (2026-02-19): make overall feel more like Stardew Valley
- Re-themed UI and screens to warm, cozy farm-sim colors and pixel-ish typography.
- Updated title/content language (Meadow Drift, Start Day, Harvest, etc.) for cohesive tone.
- Replaced deep-sea background with tiled meadow + dirt paths + flower speckles + pond highlights.
- Reworked entity visuals into cute, simple critter sprites (face + outline + player hat ring).
- Switched controls to keyboard-first 8-direction movement (WASD/Arrows), mouse as assist.
- Tuned movement/zoom to feel less floaty and more top-down action-RPG.
- Kept deterministic hooks and physics loop intact (`render_game_to_text`, `advanceTime`, fixed-step update).

### Verification
- JS syntax check passed.
- Playwright loop: 6 iterations, screenshots and state JSON generated successfully.
- Manual browser automation confirmed key press changes movement state (`W` drove upward velocity/position).

## Follow-up request (2026-02-19): add provided Primordial Harvest design view
- Added new route/page: `primordial-harvest.html` using the provided design (layout, typography, colors, animations, UI structure).
- Connected existing game view to the new design view via start-screen link: `Open Primordial Harvest View`.
- Added inline favicon on the new page to eliminate favicon 404 console error.
- Verified route navigation in-browser (`/index.html` -> `/primordial-harvest.html`) and validated console has zero errors.

## Clarification update (2026-02-19): provided code is the level-up screen
- Integrated the provided Primordial Harvest layout into `index.html` as an in-game full-screen overlay (`#levelup-screen`) instead of keeping it as a separate primary page flow.
- Wired overlay to progression: when stage thresholds are crossed, queued level-up screens open and pause gameplay.
- Added start-screen `Preview Level-Up Screen` button for quick QA and iteration.
- Added close/continue actions (`Resume`, `Grow Organism!`) and Escape/Enter support while overlay is open.
- Included level-up state in `render_game_to_text` (`levelUpOpen`) for deterministic automation visibility.

### Validation
- JS syntax check passed.
- Playwright checks confirmed preview open/close works and gameplay resumes.
- Playwright client run still captures normal gameplay states with no error dumps.

## Follow-up request (2026-02-19): tiny-cell spawn + level loop with upgrades
- Spawn baseline is now tiny (`BASE_R = 8`) and stage thresholds were retuned for early growth pacing.
- Added XP/level progression state (`playerLevel`, `playerXp`, `xpToNext`) and upgrade ranks (`cilia`, `eye`, `chloroplast`, `membrane`).
- Level-ups now queue from XP gains, pause the arena, open the Primordial Harvest upgrade overlay, require one choice, then resume arena play.
- Upgrade effects are persistent and feed into simulation stats:
  - `cilia`: movement force and top speed
  - `eye`: pickup reach
  - `chloroplast`: passive DNA/sec
  - `membrane`: predator resistance tolerance
- HUD now reflects leveling flow (`LV`, current XP/next XP target), and level-up state is exposed through `render_game_to_text`.

### Validation
- Playwright game client run succeeded against `http://127.0.0.1:4173` with fresh screenshots/state output.
- Browser automation verified full loop end-to-end:
  1. Start arena
  2. Gain XP to trigger level-up
  3. Select upgrade card
  4. Confirm upgrade
  5. Return to arena with persisted upgrade ranks in state JSON
- Evidence state after loop: `levelUpOpen=false`, `paused=false`, and upgraded stats reflected in `upgrades` payload.

## Follow-up request (2026-02-19): pixel-art Spore + Stardew direction, small-to-big map flow
- Added a true starter biome flow:
  - New locked `START_POOL` hatch environment.
  - Player now spawns inside hatch pool as a tiny cell.
  - Gate opens only after early progression (`unlockLevel`/`unlockRadius`), then world repopulates and play expands into full arena.
- Added starter boundary behavior:
  - While locked, player and starter entities are clamped to pool bounds.
  - On unlock, clamp is removed and the corridor is visually opened.
- Switched rendering to pixel-upscaled pass:
  - Scene now renders to a low-resolution buffer (`pixelCanvas`) and scales up to screen with smoothing disabled.
  - Added canvas `image-rendering: pixelated`/`crisp-edges`.
- Reworked art direction away from smiley circles:
  - New Spore-inspired cell anatomy (`genAnatomy`) with tails/flagella, cilia, organelles, and nucleus.
  - Removed face/hat styling from gameplay cells.
  - Food models retuned to simple pixel-shaped primitives.
  - Background retuned to tile-based pixel terrain with hatch-pool and corridor context.
- HUD/state updates:
  - Added `starterGateOpen` to `render_game_to_text` payload for deterministic checks.
  - Added hatch-pool text copy in start screen.
- Fixed camera/world edge regression by clamping camera view rectangle to world bounds.

### Validation
- Playwright client run (6 iterations) passed with no console errors and generated fresh screenshots/state JSON.
- Verified deterministic state transitions:
  - early run remains in hatch pool (`starterGateOpen=false`)
  - post-progression run opens map (`starterGateOpen=true`)
  - level-up overlay + upgrade loop still functions.
- Visual checks:
  - hatch-pool confinement and gate visuals are visible in `output/web-game/shot-0.png` to `shot-5.png`
  - open-world pixel look confirmed in `output/pixel-open-world-clamped.png`.

## Follow-up request (2026-02-19): stronger pixel look + explicit Spore eyes/biters
- Increased global pixelation by raising render upscaling (`PIXEL_SCALE` from 3 to 4).
- Reworked anatomy generation to emphasize creature-like micro-organisms:
  - more prominent eye pods on stalks
  - visible biter jaws near the forward direction
  - retained tails/flagella and cilia for propulsion silhouette
- Removed face-like focal treatment by relying on organelles + external eye pods instead of cartoon facial expression cues.
- Tuned minimum feature sizes so eyes and jaws remain readable at small/medium radii.

### Validation
- JS syntax check passed on extracted script.
- Playwright loop run succeeded with no console errors.
- Visual check confirms chunkier pixel presentation and visible appendage/eye details in `output/spore-cells-pixel-detail.png`.

## Follow-up request (2026-02-19): level-up overlay match + live current-cell preview
- Executed checklist in order:
  1. Restyle level-up screen to match in-game pixel direction.
  2. Convert level-up to transparent overlay modal over gameplay.
  3. Replace static/fake specimen with live player-cell preview.
  4. Re-verify gameplay + level-up flow.
- Level-up center panel now uses live canvas preview (`#levelup-cell-canvas`) driven by current `player` anatomy and palette via `drawLevelUpCellPreview()` + `drawCell()`.
- Overlay keeps arena visible underneath using translucent backdrop/panels and modal window composition instead of full scene swap.
- Level-up state remains wired to progression (`openLevelUpScreen` / `closeLevelUpScreen`) and still enforces upgrade selection before resume (non-preview mode).

### Validation
- JS syntax check passed (`node --check` on extracted script).
- Automated Playwright client run completed with fresh states/screenshots (`output/web-game/state-0..5.json`, `output/web-game/shot-0..5.png`).
- Targeted browser verification:
  - Forced level-up open during active run (`levelUpOpen=true`, `paused=true`).
  - Confirmed overlay visuals and live specimen preview screenshot: `output/validation/levelup-overlay-live-cell.png`.
  - Selected an upgrade and resumed arena (`levelUpOpen=false`, `paused=false`), screenshot: `output/validation/arena-after-levelup-resume.png`.

## Follow-up request (2026-02-19): code cleanup pass
- Refactored repeated DOM lookups into a single cached `ui` object to reduce `getElementById` / `querySelectorAll` churn and improve readability/maintainability.
- Updated HUD, level-up, game-over, danger, input, and button listener code paths to use cached refs.
- Removed obsolete level-up CSS for old doodle/creature animation variants (`.lu-bg-doodle`, `.lu-creature-stage`, `.lu-particle`, related keyframes) that are no longer present in markup.
- Kept gameplay behavior unchanged; this pass is structural cleanup only.

### Validation
- JS syntax check passed after refactor.
- Browser smoke test passed:
  - Start screen loads.
  - Preview level-up opens.
  - Overlay closes via `Back to Start`.

## Follow-up request (2026-02-19): slower leveling + rename game
- Rebalanced XP pacing to slow early level-up cadence:
  - Level curve changed from `22 + 11L + 1.8L²` to `48 + 16L + 3.6L²`.
  - XP per food reduced (`1.4*r` -> `0.65*r`, with min 0.5).
  - XP per cell reduced (`5.5*r` -> `2.25*r`, with min 2.5).
  - Passive DNA XP reduced (`0.85*grant` -> `0.35*grant`).
- Renamed user-facing game branding to `cell-game`:
  - HTML title
  - Start screen title
  - Level-up header title

### Validation
- JS syntax check passed.
- Browser check confirmed page title and branding render as `cell-game`.
- In-game HUD now starts at `XP 0/68` for level 1 (previously `XP 0/35`), confirming slower level progression target.

## Follow-up request (2026-02-20): make the game more aesthetic
- Applied a visual polish pass focused on atmosphere and cohesion with the pixel-art world:
  - Top HUD bar now uses warmer gradients, stronger depth shadowing, and an inset highlight edge.
  - Start screen now has subtle ambient drift lighting to feel more alive.
  - Minimap styling updated with layered gradients and inner highlight framing.
- Added dynamic in-game atmosphere layers without changing core mechanics:
  - world tint grading + moving light shafts
  - soft sunlight bloom
  - starter-pool shimmer scan lines
  - post-process vignette and drifting screen motes
- Enriched static terrain texture generation:
  - additional grass grain variation
  - path weathering speckles
  - tiny flower clusters with subtle shadow accents

### Validation
- JS syntax check passed (`node --check` on extracted script).
- Local server check passed (`http://127.0.0.1:4173/index.html` returns HTTP 200).
- Automated Playwright loop run completed with fresh screenshots/states and no new console/runtime regressions.
