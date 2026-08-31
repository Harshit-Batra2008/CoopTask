# CoopTask

Team: **CodeCooperatives**
Smart India Hackathon 2026 — Problem Statement 26089
Cooperative Gig Services Platform for Household & Community Services

> Internal/repo note: this project was originally scaffolded under the
> working name "TrustServe." The product is now branded **CoopTask** in
> all user-facing UI. "TrustServe" may still appear in early commit
> history or historical planning docs tied to the PS — that's expected
> and not something to "fix."

## Current status: PHASE 2 — Frontend foundation

- Phase 0: project scaffold (React + Vite, Express, Prisma) — done
- Phase 1: Prisma schema designed and approved (no tables created yet) — done
- Phase 2 (this): mobile-first frontend foundation — branding, layout
  shell, role-aware navigation, placeholder role screens — in progress
- Not yet built: authentication, backend business routes, database
  tables/migrations, AI forecasting, payments

## Architecture

```
React/Vite (frontend/)  --->  Express API (backend/)  --->  PostgreSQL (via Prisma)
```

- `frontend/` — React app (Vite), mobile-first responsive UI
- `backend/` — Express REST API
- `backend/prisma/schema.prisma` — approved Phase 1 schema (no tables created yet)

## Frontend structure (Phase 2)

```
frontend/src/
├── styles/          design tokens + global base styles (no CSS framework)
├── components/
│   ├── layout/      AppShell, TopBar, BottomNav
│   └── ui/          Card, Button, StatusBadge
├── pages/
│   ├── customer/    CustomerHome
│   ├── worker/      WorkerHome
│   └── admin/       AdminHome
└── dev/             DEV-ONLY tools (temporary role switcher, backend
                      health check) — not product features, safe to
                      delete once real authentication exists
```

## Requirements to run locally

- Node.js 18+ (scaffold generated against Node v22.22.2)
- npm
- A local or cloud PostgreSQL instance (not required yet — no tables exist)

## How to run

1. Backend: `cd backend && npm install && npm run dev` → http://localhost:4000
2. Frontend: `cd frontend && npm install && npm run dev` → http://localhost:5173
3. Open http://localhost:5173 — you'll land on a **dev-only role switcher**
   (clearly marked, not a real product screen) to preview the
   customer/worker/admin shells until real login exists.

## Development phases

Phase 0: Foundation scaffold — done
Phase 1: Prisma schema design — done
Phase 2 (this): Frontend foundation (branding, layout, navigation shells) — in progress
Phase 3: Authentication
Phase 4: MVP functional core (bookings, matching, verification) connected to backend + DB
Phase 5: Payments (mock), invoices, ratings
Phase 6: Emergency booking, multilingual UI
Phase 7: AI demand forecasting & workforce allocation (Python component)
Phase 8: Testing
Phase 9: Deployment prep
