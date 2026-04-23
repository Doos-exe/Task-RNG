# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture Overview

**TaskRoulette** is a Next.js 15 (App Router) productivity game app where users spin a slot machine or roll dice to get randomly assigned tasks or leisure activities.

### State & Data Layers

There are currently **two parallel data layers** — this is the most important architectural fact:

1. **Zustand store (`lib/store.ts`) + localStorage** — what the frontend *actually uses*. Tasks, leisure items, coins, timers, and pity counters are persisted to localStorage keyed by `userId`.

2. **Supabase backend (`app/api/`)** — fully built but **not yet wired to the frontend**. All API routes exist (tasks, leisure, progress, timer), RLS is configured, but frontend components still read/write Zustand, not the API. Phase 4 (wiring frontend to API) is incomplete per `IMPLEMENTATION_SUMMARY.md`.

When modifying data access, target the Zustand store — not the API routes — unless explicitly migrating to the backend.

### Core Game Logic

**Weighted probability** (`lib/probability.ts`):
- Task weight = (pending tasks count) × 5; Leisure weight = 10 per activity
- Pity system forces the opposite category after 4+ consecutive same-type results (`checkForcedCategory`)
- `filterPityItems` prevents recently-spun items from appearing again

**Spin page** (`app/spin/page.tsx`): Slot machine with 5s Framer Motion animation. Result drives a commitment timer (30/45/60 min by task priority; random for leisure). Coins: earned on early completion, spent on skips.

**Roll page** (`app/roll/page.tsx`): Player picks Task or Leisure, then both sides roll dice. Winner gets their pick; loser gets the opposite. Re-roll costs escalate on consecutive skips.

**Bet page** (`app/bet/page.tsx`): Full CRUD for tasks (with priority: Low/Medium/High) and leisure activities via `TaskList` component.

### Authentication

`lib/useAuth.ts` — React hook wrapping Supabase Auth. Email signup triggers verification; on verification users are redirected to `/auth?verified=true`.

`lib/apiUtils.ts` — `requireAuth()` helper extracts and validates the JWT on API routes.

`lib/supabaseAdmin.ts` — admin client using `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS; server-side only).

### Key Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY    # Server-side only, never expose to client
```

### Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`).
