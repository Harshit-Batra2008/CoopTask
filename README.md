# TrustServe

Smart India Hackathon 2026 — Problem Statement 26089
Cooperative Gig Services Platform for Household & Community Services

## Current status: PHASE 0 — Foundation only

This repository currently contains ONLY the project skeleton:
- No database tables
- No authentication
- No business features
- No AI
- No payments

These are all intentionally deferred to later phases.

## Architecture

```
React (frontend/)  --->  Express API (backend/)  --->  PostgreSQL (via Prisma)
```

- `frontend/` — React app (built with Vite)
- `backend/` — Express REST API
- `backend/prisma/schema.prisma` — Prisma schema (currently empty of models — DB connection config only)

## Requirements to run locally (not pre-installed in this scaffold)

- Node.js 18+ (this scaffold was generated against Node v22.22.2)
- npm
- A local or cloud PostgreSQL instance (not required yet — no tables exist)

## How to run (after `npm install` in both folders — see main chat explanation)

1. Backend: `cd backend && npm install && npm run dev` → runs on http://localhost:4000
2. Frontend: `cd frontend && npm install && npm run dev` → runs on http://localhost:5173

The frontend home page calls the backend's `/api/health` endpoint to confirm the two are connected.

## Development phases

Phase 0 (this): Foundation scaffold only
Phase 1: Core schema + basic auth
Phase 2: MVP functional core (bookings, matching, verification)
Phase 3: Payments (mock), invoices, ratings
Phase 4: Emergency booking, multilingual UI
Phase 5: AI demand forecasting & workforce allocation
Phase 6: Testing
Phase 7: Deployment prep
