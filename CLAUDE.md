# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at localhost:3000
npm run build     # Production build
npm run preview   # Preview production build
```

No test suite is configured.

## Architecture

**Infinite Alchemy** is a browser-based alchemy puzzle game (React + TypeScript + Vite). Players combine elements to discover new ones across 4 progressive game stages.

### Data Layer

All game content is declarative JSON:
- `data/elements.json` — 200+ element definitions (`name`, `emoji`, `group`, `stage`)
- `data/combinations.json` — 500+ combination rules (ingredient pairs → result)

`services/dataService.ts` loads these files and exposes the game logic. It uses in-memory Maps for O(1) lookups and normalizes names to lowercase for case-insensitive matching.

### State Management

`App.tsx` is the single state container (React hooks). Game state is auto-persisted to `localStorage` under the key `infinite_alchemy_save` (see `constants.ts`). State includes: unlocked elements, discovery history, cached recipes, stage progression.

### Component Structure

- `App.tsx` — orchestrates all state and handlers; composes child components
- `CombinationArea.tsx` — two-slot element input + result display (core gameplay)
- `ElementStrip.tsx` — horizontal scrollable element browser
- `GroupFilter.tsx` — category filter with per-group progress counts
- `HistoryDrawer.tsx` — slide-out discovery timeline
- `ElementCard.tsx` — single element pill/badge (presentational only)

### Game Flow

1. Player clicks two elements → stored in `slot1` / `slot2`
2. `combineElements()` is called automatically
3. Result cached in `recipes` map
4. New discoveries added to `unlocked` + `history`
5. Stage thresholds checked (100 / 140 / 180 elements unlock new stages)

### Customization

To add content, edit the JSON files following patterns already present:
- New element: add an entry to `data/elements.json`
- New combination: add an entry to `data/combinations.json`
- New group or stage: update `constants.ts` (`GROUP_INFO`, `STAGE_THRESHOLDS`)

See `CUSTOMIZATION_GUIDE.md` for detailed instructions.

### Tech Stack

- React 19 + TypeScript, bundled with Vite 6
- Tailwind CSS and Font Awesome loaded via CDN (no local CSS build step)
- No backend; fully offline
