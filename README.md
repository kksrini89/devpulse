# DevPulse

> Developer Analytics Dashboard — "Fitbit for developers" tracking coding activity and project health.

## Features

- **Dashboard** — Overview with stats cards, activity charts, recent projects
- **Projects** — CRUD operations with status tracking and metrics
- **Analytics** — Time-series visualizations with period selectors
- **Dark/Light Mode** — Theme toggle with system preference detection

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts
- **Icons:** Lucide React
- **Validation:** Zod

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type check |

## Project Structure

```
src/
├── app/                    # Next.js App Router (routing only)
│   └── (dashboard)/        # Route group with shared layout
├── features/               # Feature modules (analytics, projects)
│   └── [feature]/
│       ├── components/     # Feature-specific components
│       ├── actions.ts      # Server Actions
│       └── queries.ts      # Data fetching
├── components/
│   ├── ui/                 # Atomic UI components
│   └── layout/             # Layout components (Sidebar, Header)
├── lib/
│   ├── db/                 # In-memory database layer
│   └── utils/              # Utilities (cn, dates, numbers)
└── types/                  # TypeScript definitions
```

## Architecture

- **Feature-based organization** — Code grouped by domain, not technical role
- **Server Components** — Default for data fetching, zero JS bundle cost
- **Client Components** — Only for interactivity (charts, toggles, forms with state)
- **Server Actions** — Mutations with Zod validation and `revalidatePath()`
