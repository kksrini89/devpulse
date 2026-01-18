# AGENTS.md - DevPulse

> Developer Analytics Dashboard — "Fitbit for developers" tracking coding activity and project health.

## Commands
- **Dev:** `npm run dev` | **Build:** `npm run build` | **Lint:** `npm run lint` | **Typecheck:** `npx tsc --noEmit`

## Architecture
- **Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4
- **Data:** In-memory DB in `src/lib/db/` (async, swappable to real DB via `db.projects.findMany()` API)
- **Structure:** Feature-based ("Screaming Architecture") — `src/features/` with `components/`, `actions.ts`, `queries.ts`
- **Routing:** `app/` is thin (imports from features); `(dashboard)` route group shares layout without affecting URLs

## Component Patterns
- **Server Components:** Default. Use for data fetching (stats cards, tables), no JS bundle cost
- **Client Components:** Only when needed (`onClick`, `useState`, browser APIs) — add `"use client"` (charts, toggles)
- **UI components** (`src/components/ui/`): Atomic, presentational, extend native HTML attributes
- **Variants over booleans:** Use `variant="primary"` not `isPrimary`

## Data Flow
- **Reads:** Server Component → directly calls `db.*` functions (no useEffect)
- **Mutations:** Server Actions in `actions.ts` → validates with Zod → mutates → `revalidatePath()`
- **Forms:** Native FormData + Server Actions (progressive enhancement)

## Code Style
- Imports: `@/*` alias → `./src/*`; barrel exports via `index.ts`
- Libraries: `cn()` for classes, `date-fns` for dates, `zod` for validation, `lucide-react` for icons, `recharts` for charts
- Types: Define in `src/types/`, strict mode enabled
- Accessibility: `focus-visible:` for keyboard focus, ARIA labels on icon buttons, skip links

## Error Handling
- `app/error.tsx` — route errors | `app/global-error.tsx` — root layout failures (must include `<html>`)
- `app/not-found.tsx` — 404 page | Use `notFound()` function to trigger
