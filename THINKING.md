# DevPulse — Build Thinking Journal

> This document captures the reasoning behind every architectural and implementation decision as we build DevPulse.

---

## Phase 1: Foundation

### Feature 1.1: Project Structure Setup

**Date**: Today

#### What We're Building
The folder structure that will house our entire application. This is the skeleton upon which everything else is built.

#### My Thinking Process

**1. Why Feature-Based Over Technical Grouping?**

When I look at a codebase, I ask: "What does this app DO?"

```
Technical grouping answers: "It has components, hooks, and utils"
Feature grouping answers: "It has a dashboard, projects, and analytics"
```

The second answer is more useful. When I need to fix a bug in the projects feature, I go to `features/projects/` and everything is there — components, actions, queries, types.

**2. Why Separate `app/` from `features/`?**

The `app/` directory in Next.js is **routing-focused**. It should be thin — mostly importing and composing from `features/`.

```tsx
// app/(dashboard)/projects/page.tsx
// This file should be simple:
import { ProjectsPage } from '@/features/projects/components/ProjectsPage';
export default ProjectsPage;
```

This separation gives us:
- **Routing logic** in `app/` (URLs, layouts, loading states)
- **Business logic** in `features/` (components, data, actions)

**3. Why `(dashboard)` Route Group?**

Route groups (parentheses folders) let us:
- Share a layout across multiple routes without affecting the URL
- `/projects` not `/(dashboard)/projects`

All dashboard pages share:
- Sidebar navigation
- Header with user info
- Same authentication requirements

**4. Why `lib/` Separate from `features/`?**

`lib/` contains **infrastructure code** — things that are:
- Not tied to any specific feature
- Could theoretically be extracted to a package
- Examples: database client, date utilities, classname helper

**5. Why `components/ui/` for Atomic Components?**

These are the building blocks — Button, Card, Input. They:
- Have no business logic
- Are purely presentational
- Are used across multiple features

Think of them as your design system.

#### Files Created

```
src/
├── features/           # Feature modules (empty, ready for features)
│   ├── dashboard/
│   ├── projects/
│   ├── analytics/
│   └── auth/
├── components/
│   ├── ui/             # Atomic components
│   ├── layout/         # Layout components
│   └── charts/         # Chart components
├── lib/
│   ├── db/             # Database layer
│   └── utils/          # Utility functions
├── hooks/              # Shared hooks
└── types/              # Global types
```

---

### Feature 1.2: Utility Functions

#### What We're Building
Core utility functions that will be used throughout the app.

#### My Thinking Process

**1. The `cn()` Function — Why?**

In Tailwind, we often need to:
- Combine multiple class strings
- Add classes conditionally
- Override conflicting classes

```tsx
// Without cn():
<div className={`px-4 py-2 ${isActive ? 'bg-blue-500' : 'bg-gray-500'} ${className}`}>

// With cn():
<div className={cn('px-4 py-2', isActive && 'bg-blue-500', className)}>
```

We use `clsx` for conditional joining and `tailwind-merge` to resolve conflicts:
- `cn('px-4', 'px-8')` → `'px-8'` (not `'px-4 px-8'`)

**2. Date Utilities — Why Wrap date-fns?**

Consistency. Instead of importing different functions everywhere:

```tsx
// Without wrapper:
import { format } from 'date-fns';
import { formatDistanceToNow } from 'date-fns';
// Different formats across the app...

// With wrapper:
import { formatDate, formatRelative } from '@/lib/utils/dates';
// Consistent formats everywhere
```

**3. Number Utilities — Why?**

Dashboards show lots of numbers. We need consistent formatting:
- `1234` → `1,234`
- `1234567` → `1.2M`
- `0.156` → `15.6%`

---

### Feature 1.3: Shared UI Components

#### What We're Building
Reusable, atomic UI components: Button, Card, Input, Badge, Skeleton.

#### My Thinking Process

**1. Server or Client Components?**

Most UI components can be Server Components! They only need `"use client"` if they:
- Use `onClick`, `onChange`
- Use `useState`, `useEffect`
- Use browser APIs

```tsx
// Card.tsx — Server Component (no "use client")
// Just receives props and renders JSX

// Button.tsx — Needs "use client" because of onClick
"use client";
```

Wait, but Button always has onClick... or does it?

Actually, when used inside a `<form>` with Server Actions, buttons work without JavaScript:
```tsx
<form action={serverAction}>
  <button type="submit">Save</button>  // Works as Server Component!
</form>
```

But for flexibility (standalone buttons with onClick), we'll make Button a Client Component.

**2. Component API Design**

I follow these principles:
- **Props extend native HTML attributes** — `ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>`
- **Variants over boolean props** — `variant="primary"` not `isPrimary`
- **Composition over configuration** — children over icon prop

**3. Why Skeleton Components?**

Next.js `loading.tsx` needs skeleton UIs. Pre-built Skeleton components make this easy:

```tsx
// loading.tsx
<Card>
  <Skeleton className="h-8 w-32" />  // Title
  <Skeleton className="h-4 w-24" />  // Subtitle
</Card>
```

---

### Feature 1.4: Layout Components

#### What We're Building
Sidebar, Header, and ThemeToggle for the dashboard layout.

#### My Thinking Process

**1. Sidebar as Server Component?**

The Sidebar just renders navigation links. It doesn't need state. But wait:
- On mobile, we need to toggle sidebar open/closed
- That's state → Client Component

**Solution**: Composition pattern
```tsx
// Sidebar.tsx (Server) — renders the structure
// SidebarMobile.tsx (Client) — handles toggle state
// SidebarNav.tsx (Server) — just the nav links
```

For MVP, we'll make the whole Sidebar a Client Component for simplicity. We can optimize later.

**2. Header Component**

Contains:
- Page title (passed as prop)
- User avatar (mock for now)
- Theme toggle

**3. ThemeToggle — Classic Client Component**

Toggles dark/light mode. Needs:
- State for current theme
- onClick handler
- localStorage for persistence
- System preference detection

This is a textbook Client Component use case.

---

### Feature 1.5: Data Layer

#### What We're Building
In-memory database with JSON file persistence and seed data.

#### My Thinking Process

**1. Why Abstract the Database?**

We create a `db` object with methods like:
- `db.projects.findMany()`
- `db.projects.create(data)`
- `db.activities.findByProject(id)`

This abstraction means:
- Swap to PostgreSQL later without changing feature code
- Test with mock data easily
- Keep database logic in one place

**2. Data Model Design**

```typescript
Project {
  id
  name
  description
  status: 'active' | 'paused' | 'completed'
  color (for UI)
  createdAt
  updatedAt
}

Activity {
  id
  projectId
  type: 'commit' | 'review' | 'deploy' | 'issue'
  description
  timestamp
  metadata (flexible JSON)
}

DailyStats {
  date
  commits
  reviews
  deploys
  hoursLogged
}
```

**3. Seed Data — Why Realistic?**

Fake data should feel real:
- Use actual project names ("DevPulse", "API Gateway")
- Spread activities over the past 30 days
- Vary the numbers realistically

This makes development enjoyable and catches UI edge cases early.

---

## Summary: Phase 1 Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Feature-based | Scalable, discoverable |
| Route groups | `(dashboard)` | Shared layout, clean URLs |
| UI components | Mix of Server/Client | Minimize JS bundle |
| Styling | Tailwind + `cn()` | Fast, composable |
| Database | In-memory + JSON | Zero setup, swappable later |
| Data model | Projects + Activities + Stats | Covers dashboard needs |

---

---

## Phase 1: COMPLETED ✓

### Files Created

```
src/
├── app/
│   ├── globals.css              ✓ Updated with dark mode support
│   ├── layout.tsx               ✓ Root layout with fonts
│   └── (dashboard)/
│       ├── layout.tsx           ✓ Sidebar + main content area
│       ├── page.tsx             ✓ Dashboard home with stats
│       ├── loading.tsx          ✓ Skeleton loading state
│       └── error.tsx            ✓ Error boundary
├── components/
│   ├── ui/
│   │   ├── Button.tsx           ✓ Variants, sizes, loading state
│   │   ├── Card.tsx             ✓ Composable card parts
│   │   ├── Input.tsx            ✓ With label and error
│   │   ├── Textarea.tsx         ✓ With label and error
│   │   ├── Select.tsx           ✓ With options
│   │   ├── Badge.tsx            ✓ Color variants
│   │   ├── Skeleton.tsx         ✓ Multiple skeleton types
│   │   └── index.ts             ✓ Barrel export
│   └── layout/
│       ├── Sidebar.tsx          ✓ Responsive with mobile toggle
│       ├── Header.tsx           ✓ Title, description, actions
│       ├── ThemeToggle.tsx      ✓ Light/dark/system
│       └── index.ts             ✓ Barrel export
├── lib/
│   ├── constants.ts             ✓ App-wide constants
│   ├── db/
│   │   ├── index.ts             ✓ Database abstraction layer
│   │   └── seed.ts              ✓ Realistic seed data
│   └── utils/
│       ├── cn.ts                ✓ Classname utility
│       ├── dates.ts             ✓ Date formatting
│       ├── numbers.ts           ✓ Number formatting
│       └── index.ts             ✓ Barrel export
└── types/
    ├── project.ts               ✓ Project types
    ├── activity.ts              ✓ Activity types
    ├── analytics.ts             ✓ Analytics types
    └── index.ts                 ✓ Barrel export
```

### What We Learned

1. **Route Groups** — `(dashboard)` creates a shared layout without affecting URLs
2. **Server Components by Default** — Most UI is server-rendered
3. **Parallel Data Fetching** — `Promise.all()` for simultaneous requests
4. **Automatic Loading States** — `loading.tsx` = Suspense boundary
5. **Error Boundaries** — `error.tsx` catches and displays errors
6. **Component Composition** — Card with CardHeader, CardTitle, etc.
7. **Utility Functions** — `cn()` for class merging, date/number formatters

### Run the App

```bash
cd devpulse
npm run dev
```

Open http://localhost:3000 to see the dashboard.

---

---

## Phase 2: Projects Feature

### Feature 2.1: Projects List Page

**Date**: Today

#### What We're Building
A page at `/projects` that displays all projects with their stats, status badges, and action buttons.

#### My Thinking Process

**1. Server or Client Component for the List?**

The list itself is purely display — no interactivity needed for rendering. It should be a **Server Component**.

But wait, we need:
- Delete button (needs onClick) → Client Component
- Edit link (just a Link) → Works in Server Component

**Solution**: The page and list are Server Components. Only the delete button is extracted as a small Client Component.

```
ProjectsPage (Server)
└── ProjectCard (Server)
    ├── Badge (Server)
    ├── Link to edit (Server)
    └── DeleteButton (Client) ← Only this needs "use client"
```

**2. Where to Put Feature Components?**

Following our architecture:
- `src/features/projects/components/` — Feature-specific components
- `src/app/(dashboard)/projects/page.tsx` — Just imports and renders

The page file stays thin, the feature folder holds the logic.

**3. Data Fetching Pattern**

```tsx
// In page.tsx (Server Component)
export default async function ProjectsPage() {
  const projects = await db.projects.findManyWithStats();
  return <ProjectList projects={projects} />;
}
```

No useEffect, no loading state management, no error handling boilerplate. The `loading.tsx` and `error.tsx` files handle those automatically.

---

### Feature 2.2: Project Detail Page (Dynamic Route)

#### What We're Building
A page at `/projects/[id]` showing single project details with edit form.

#### My Thinking Process

**1. Dynamic Route Syntax**

The `[id]` folder creates a dynamic segment:
- `/projects/proj_1` → `params.id = "proj_1"`
- `/projects/proj_2` → `params.id = "proj_2"`

```tsx
interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await db.projects.findById(id);
  // ...
}
```

**2. Handling Not Found**

If the project doesn't exist, we use Next.js's `notFound()` function:

```tsx
import { notFound } from 'next/navigation';

if (!project) {
  notFound(); // Renders the nearest not-found.tsx
}
```

**3. Edit Form: Server Component or Client Component?**

The form needs:
- Input state management → Could use native HTML + Server Actions
- Validation feedback → Server Action returns errors
- Submit handling → Server Action

We can make this work with mostly server-side logic using the **progressive enhancement** pattern:

```tsx
<form action={updateProject}>
  <input name="title" defaultValue={project.title} />
  <button type="submit">Save</button>
</form>
```

But for better UX (loading states, inline validation), we'll make the form a Client Component with `useActionState`.

---

### Feature 2.3: Server Actions for Mutations

#### What We're Building
Server-side functions for create, update, and delete operations.

#### My Thinking Process

**1. Where to Define Server Actions?**

Option A: In the page file (colocated)
Option B: In `features/projects/actions.ts` (separated)

I prefer **Option B** because:
- Actions can be reused across pages
- Easier to test
- Cleaner page files

**2. Server Action Pattern**

```tsx
"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProject(formData: FormData) {
  // 1. Extract data
  const name = formData.get('name') as string;
  
  // 2. Validate (with Zod)
  const validated = ProjectSchema.safeParse({ name, ... });
  if (!validated.success) {
    return { error: validated.error.flatten() };
  }
  
  // 3. Mutate database
  await db.projects.create(validated.data);
  
  // 4. Revalidate cache (so lists update)
  revalidatePath('/projects');
  
  // 5. Redirect
  redirect('/projects');
}
```

**3. Validation Strategy**

We use Zod for schema validation:
- Type-safe
- Great error messages
- Works on server and client

```tsx
const ProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  status: z.enum(["active", "paused", "completed"]),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, "Invalid color"),
});
```

**4. Delete Action Pattern**

Delete is simpler — no form data, just an ID:

```tsx
export async function deleteProject(id: string) {
  await db.projects.delete(id);
  revalidatePath('/projects');
}
```

Called from a Client Component button:

```tsx
"use client";

function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  
  const handleDelete = () => {
    if (confirm("Delete this project?")) {
      startTransition(() => deleteProject(id));
    }
  };
  
  return <button onClick={handleDelete}>Delete</button>;
}
```

---

### Feature 2.4: Form Component

#### What We're Building
A reusable form for both creating and editing projects.

#### My Thinking Process

**1. One Form for Create and Edit**

Instead of separate forms, one form handles both:

```tsx
interface ProjectFormProps {
  project?: Project; // If provided, we're editing
}

function ProjectForm({ project }: ProjectFormProps) {
  const isEditing = !!project;
  // Use project values as defaults if editing
}
```

**2. useActionState for Form State**

React 19's `useActionState` hook manages:
- Pending state
- Error state
- Form submission

```tsx
const [state, formAction, isPending] = useActionState(
  async (prevState, formData) => {
    const result = await createProject(formData);
    return result; // { error: ... } or null
  },
  null
);
```

**3. Color Picker**

For project colors, we provide preset options rather than a full color picker (simpler, more consistent):

```tsx
{PROJECT_COLORS.map(color => (
  <button
    type="button"
    onClick={() => setSelectedColor(color.value)}
    style={{ backgroundColor: color.value }}
  />
))}
```

---

## Phase 2: COMPLETED ✓

### Files Created

```
src/
├── app/(dashboard)/projects/
│   ├── page.tsx                 ✓ Projects list page
│   ├── loading.tsx              ✓ List loading skeleton
│   ├── new/
│   │   └── page.tsx             ✓ New project form
│   └── [id]/
│       ├── page.tsx             ✓ Project detail + edit form
│       ├── loading.tsx          ✓ Detail loading skeleton
│       └── not-found.tsx        ✓ 404 for missing projects
│
└── features/projects/
    ├── actions.ts               ✓ Server Actions (create, update, delete)
    ├── queries.ts               ✓ Data fetching functions
    └── components/
        ├── ProjectCard.tsx      ✓ Project card (Server Component)
        ├── ProjectForm.tsx      ✓ Create/Edit form (Client Component)
        ├── DeleteProjectButton.tsx ✓ Delete button (Client Component)
        └── index.ts             ✓ Barrel export
```

### Key Patterns Demonstrated

1. **Feature-Based Architecture**
   - All project-related code in `features/projects/`
   - Pages are thin, just import and render

2. **Server Actions with Zod Validation**
   ```tsx
   "use server";
   const validated = ProjectSchema.safeParse(formData);
   if (!validated.success) return { errors: ... };
   await db.projects.create(validated.data);
   revalidatePath('/projects');
   redirect('/projects');
   ```

3. **Minimal Client Components**
   - Only `DeleteProjectButton` and `ProjectForm` are Client Components
   - Everything else is Server Component

4. **Dynamic Routes**
   - `[id]` folder creates `/projects/:id`
   - `notFound()` triggers `not-found.tsx`

5. **useActionState for Forms**
   - Manages pending state, errors, and submission
   - Works with Server Actions seamlessly

### What You Can Do Now

1. View all projects at `/projects`
2. Create new project at `/projects/new`
3. Edit project at `/projects/[id]`
4. Delete project (with confirmation)
5. See loading skeletons during navigation

### Run and Test

```bash
cd devpulse
npm run dev
```

Try:
- Go to `/projects`
- Click "New Project"
- Fill the form, pick a color, submit
- Click on a project to edit
- Delete a project

---

---

## Phase 3: Analytics Feature

### Feature 3.1: Analytics Page with Charts

**Date**: Today

#### What We're Building
An analytics page at `/analytics` showing:
- Time period selector (7d, 14d, 30d, 90d)
- Activity trend chart (commits over time)
- Summary metric cards
- Project breakdown

#### My Thinking Process

**1. Recharts — Why and How?**

Recharts is a React charting library built on D3. Key concepts:

```tsx
<LineChart data={data}>
  <XAxis dataKey="date" />
  <YAxis />
  <Line dataKey="commits" stroke="#3b82f6" />
</LineChart>
```

It's declarative like React — you describe WHAT you want, not HOW to draw it.

**2. Server or Client Component for Charts?**

Charts are definitely Client Components because:
- They use browser APIs (SVG, canvas)
- They have interactivity (tooltips, hover states)
- Recharts uses hooks internally

But we can still fetch data on the server:

```
AnalyticsPage (Server)          ← Fetches data
└── ActivityChart (Client)      ← Renders chart with data as prop
```

**3. Period Selector — URL State**

Instead of React state, we use URL search params:
- `/analytics?period=7d`
- `/analytics?period=30d`

Benefits:
- Shareable URLs
- Back button works
- SEO friendly
- Server Component can read it

```tsx
// In Server Component
export default async function AnalyticsPage({ searchParams }) {
  const period = searchParams.period || '30d';
  const data = await getAnalytics(period);
  return <Charts data={data} />;
}
```

**4. Dynamic Period Route Alternative**

We could also use `/analytics/[period]`:
- `/analytics/7d`
- `/analytics/30d`

Both work. URL params are simpler for optional filters.

---

### Feature 3.2: Chart Components

#### My Thinking Process

**1. Wrapper Components for Recharts**

Recharts components need specific setup. We create wrapper components:
- `LineChart` wrapper with our styling defaults
- `BarChart` wrapper
- Common tooltip styling

**2. Responsive Charts**

Recharts provides `ResponsiveContainer` for auto-sizing:

```tsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    ...
  </LineChart>
</ResponsiveContainer>
```

**3. Dark Mode Support**

Charts need to adapt to dark mode:
- Axis colors
- Grid colors
- Tooltip styling

We pass theme-aware colors to the chart components.

---

### Feature 3.3: Metric Cards with Trends

#### What We're Building
Cards showing key metrics with trend indicators:
- Total commits (vs previous period)
- Total hours (vs previous period)
- Average per day

#### My Thinking Process

**1. Calculating Trends**

```tsx
const currentPeriod = last30Days.reduce((sum, d) => sum + d.commits, 0);
const previousPeriod = previous30Days.reduce((sum, d) => sum + d.commits, 0);
const trend = (currentPeriod - previousPeriod) / previousPeriod;
```

**2. Displaying Trends**

```tsx
<TrendIndicator value={trend}>
  {trend >= 0 ? <TrendingUp /> : <TrendingDown />}
  {formatPercent(Math.abs(trend))}
</TrendIndicator>
```

Green for positive, red for negative.

---

## Phase 3: COMPLETED ✓

### Files Created

```
src/
├── app/(dashboard)/
│   ├── analytics/
│   │   ├── page.tsx             ✓ Analytics dashboard with charts
│   │   └── loading.tsx          ✓ Loading skeleton
│   └── settings/
│       └── page.tsx             ✓ Settings placeholder
│
└── features/analytics/
    ├── queries.ts               ✓ Data fetching and calculations
    └── components/
        ├── PeriodSelector.tsx   ✓ Time period picker (Client)
        ├── ActivityChart.tsx    ✓ Line/Area chart (Client)
        ├── MetricCard.tsx       ✓ Metric with trend (Server)
        ├── ProjectBreakdown.tsx ✓ Bar chart by project (Client)
        └── index.ts             ✓ Barrel export
```

### Key Patterns Demonstrated

1. **Recharts Integration**
   - Client Components for interactive charts
   - Data fetched on server, passed as props
   - ResponsiveContainer for auto-sizing

2. **URL State for Filters**
   ```tsx
   // Read from searchParams in Server Component
   const period = searchParams.period || '30d';
   
   // Update via router in Client Component
   router.push(`/analytics?period=${newPeriod}`);
   ```

3. **Server + Client Component Split**
   ```
   AnalyticsPage (Server)     ← Fetches data
   ├── MetricCard (Server)    ← Static display
   ├── ActivityChart (Client) ← Interactive chart
   └── PeriodSelector (Client) ← User interaction
   ```

4. **Parallel Data Fetching**
   ```tsx
   const [dailyStats, summary, breakdown] = await Promise.all([
     getDailyStats(period),
     getPeriodSummary(period),
     getProjectBreakdown(),
   ]);
   ```

### What You Can Do Now

1. View analytics at `/analytics`
2. Switch time periods (7d, 14d, 30d, 90d)
3. See activity trends with interactive charts
4. View project breakdown
5. Navigate to settings placeholder

### Routes Summary

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Dashboard home |
| `/projects` | Static | Projects list |
| `/projects/new` | Static | Create project |
| `/projects/[id]` | Dynamic | Project detail |
| `/analytics` | Dynamic | Analytics with charts |
| `/settings` | Static | Settings placeholder |

---

---

## Phase 4: Polish

### Feature 4.1: Global Error Boundary

**Date**: Today

#### What We're Building
A root-level error boundary and global not-found page.

#### My Thinking Process

**1. Error Hierarchy in Next.js**

```
app/
├── error.tsx           ← Catches errors in all routes
├── global-error.tsx    ← Catches errors in root layout (rare)
├── not-found.tsx       ← Global 404 page
└── (dashboard)/
    └── error.tsx       ← Catches errors only in dashboard
```

The `global-error.tsx` is special — it replaces the entire HTML when the root layout fails. It must include `<html>` and `<body>` tags.

**2. When to Use Each**

- `error.tsx` — Route segment errors (API failures, component errors)
- `global-error.tsx` — Root layout failures (extremely rare)
- `not-found.tsx` — When `notFound()` is called or route doesn't exist

---

### Feature 4.2: Empty States

#### What We're Building
Consistent empty state components when there's no data.

#### My Thinking Process

Empty states are often overlooked but crucial for UX:
- Tell users WHY it's empty
- Provide a clear action to fix it
- Use friendly, helpful language

```tsx
<EmptyState
  icon={<FolderOpen />}
  title="No projects yet"
  description="Get started by creating your first project"
  action={<Link href="/projects/new">Create Project</Link>}
/>
```

---

### Feature 4.3: Responsive Improvements

#### What We're Building
Mobile-first responsive adjustments across all pages.

#### My Thinking Process

**1. Tailwind Breakpoints**

```
sm: 640px   — Small tablets
md: 768px   — Tablets
lg: 1024px  — Laptops
xl: 1280px  — Desktops
```

**2. Mobile-First Approach**

Write mobile styles first, then add breakpoints:

```tsx
// Mobile first
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
```

**3. Key Areas to Fix**

- Sidebar: Already handled with mobile toggle
- Stats cards: Stack on mobile, grid on desktop
- Charts: Full width on mobile
- Forms: Full width inputs
- Tables: Horizontal scroll on mobile

---

### Feature 4.4: Accessibility Improvements

#### What We're Building
Keyboard navigation, focus states, and screen reader support.

#### My Thinking Process

**1. Focus Visible**

Tailwind's `focus-visible:` only shows focus ring for keyboard users:

```tsx
<button className="focus-visible:ring-2 focus-visible:ring-blue-500">
```

**2. Skip Links**

Allow keyboard users to skip to main content:

```tsx
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

**3. ARIA Labels**

For icon-only buttons:

```tsx
<button aria-label="Delete project">
  <Trash2 />
</button>
```

---

## Phase 4: COMPLETED ✓

### Files Created

```
src/
├── app/
│   ├── not-found.tsx            ✓ Global 404 page
│   └── global-error.tsx         ✓ Root-level error boundary
│
└── components/ui/
    ├── EmptyState.tsx           ✓ Consistent empty state component
    ├── Toast.tsx                ✓ Notification component
    ├── Spinner.tsx              ✓ Loading spinner
    ├── BackButton.tsx           ✓ Client-side back navigation
    └── index.ts                 ✓ Updated exports
```

### Files Modified

```
src/
├── app/(dashboard)/
│   ├── layout.tsx               ✓ Skip link for accessibility
│   ├── projects/page.tsx        ✓ Added metadata
│   ├── analytics/page.tsx       ✓ Added metadata
│   └── settings/page.tsx        ✓ Added metadata
│
└── components/
    ├── ui/Button.tsx            ✓ Focus-visible states
    └── layout/
        ├── PageTransition.tsx   ✓ Subtle fade animation
        └── index.ts             ✓ Updated exports
```

### Key Patterns Demonstrated

1. **Error Boundary Hierarchy**
   ```
   app/
   ├── global-error.tsx   ← Root layout failures (must have <html>)
   ├── not-found.tsx      ← Global 404
   └── (dashboard)/
       └── error.tsx      ← Route segment errors
   ```

2. **Accessibility Patterns**
   - Skip link for keyboard navigation
   - `focus-visible` for keyboard-only focus rings
   - ARIA labels on icon buttons
   - Semantic HTML structure

3. **SEO with Metadata**
   ```tsx
   export const metadata: Metadata = {
     title: "Projects",
     description: "Manage your projects",
   };
   ```

4. **Client/Server Component Split**
   - `BackButton` is Client (uses `window.history`)
   - `EmptyState` is Server (just renders)
   - `Toast` is Client (has state and effects)

### Component Library Summary

| Component | Type | Purpose |
|-----------|------|---------|
| Button | Client | Interactive button with variants |
| Card | Server | Container with header/content/footer |
| Input | Server | Form input with label/error |
| Textarea | Server | Multi-line input |
| Select | Server | Dropdown select |
| Badge | Server | Status/category indicator |
| Skeleton | Server | Loading placeholder |
| EmptyState | Server | No data state |
| Toast | Client | Notification feedback |
| Spinner | Server | Inline loading indicator |
| BackButton | Client | Browser back navigation |

---

## Project Complete! 🎉

### Final Route Map

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Dashboard with stats and activity |
| `/projects` | Static | Projects list with CRUD |
| `/projects/new` | Static | Create new project |
| `/projects/[id]` | Dynamic | View/edit project |
| `/analytics` | Dynamic | Charts and metrics |
| `/settings` | Static | Settings placeholder |

### What You Learned

1. **Next.js App Router** — File-based routing, route groups, dynamic routes
2. **Server Components** — Default, async data fetching, zero JS bundle
3. **Client Components** — Interactivity, hooks, "use client" directive
4. **Server Actions** — Mutations without API routes, form handling
5. **Loading/Error States** — Automatic Suspense and error boundaries
6. **Caching** — revalidatePath, searchParams for URL state
7. **Feature Architecture** — Scalable folder structure
8. **Recharts** — Declarative charts in React
9. **Accessibility** — Skip links, focus states, ARIA
10. **SEO** — Metadata API for page titles and descriptions

### Run the Complete App

```bash
cd devpulse
npm run dev
```

Open http://localhost:3000 and explore all features!
