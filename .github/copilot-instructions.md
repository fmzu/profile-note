---
applyTo: "**/*"
---

# Overview
Fusen ToDo is a lightweight sticky-notes SPA. Users drag, resize, and edit virtual notes across the home board, a canvas demo, and a slug mini-game. The stack is Vite + React + TypeScript + TanStack Router + Tailwind CSS, running entirely in the browser with optional Cloudflare deployment hooks.

## Directory Structure
- `src/routes`: Page entries such as `/`, `/board`, `/canvas`, `/slug`
- `src/components`: Reusable UI pieces (sticky-note, task-card, task-dialog, `components/ui/*`)
- `src/hooks`: Stateful hooks (`use-sticky-notes`, `use-tasks`, utility hooks)
- `src/lib`: Domain helpers (`task-model.ts`, `utils.ts`, `hono/index.ts`)
- `src/styles/app.css`: Global Tailwind layer configuration
- `src/router.tsx`, `src/route-tree.gen.ts`: Router setup and generated route manifest
- `public/`: Static assets
- `dist/`: Build output (`vite build`)

## Technical Features
- Frontend: React 19, TypeScript 5, Vite 7
- Routing: @tanstack/react-router (file-based routes)
- Styling: Tailwind CSS 4 with utility UI components (`components/ui/*`)
- Utilities: lucide-react, date-fns, clsx/cva helpers, etc.
- Tooling: Biome for lint/format, router plugin, strict tsconfig
- Tests: `bun test` (basic setup)
- Deployment (optional): Wrangler config pointing at Cloudflare Pages/Workers (`wrangler.json` references `.output`)

## Decoupled Design
- Routes (`src/routes/*`) stay thin; presentation lives in `src/components/*`
- Domain logic and shared state live under `src/lib/*` and `src/hooks/*`
- Core UX works offline with no external API calls
- Optional Cloudflare Worker entry (`src/lib/hono`) stays isolated from client features

## Core Location
- Domain model: `src/lib/task-model.ts`
- Sticky note state: `src/hooks/use-sticky-notes.ts`
- Task list state: `src/hooks/use-tasks.ts`
- Route orchestration: `src/routes/*.tsx`
- Shared UI primitives: `src/components/ui/*`, `src/components/sticky-note.tsx`

## System Independence
- Run locally via `npm run dev` (Vite)
- No backend required for default flows
- Cloudflare integration remains optional and decoupled
