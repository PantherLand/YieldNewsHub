# YieldNewsHub

A Web3 dashboard for:

- **Low-risk stablecoin APY aggregation** (MVP uses DeFiLlama yields API)
- **Market-moving news aggregation** (RSS-based MVP) with optional Telegram alerts

> Scope (v0): information aggregation only (no on-chain integration).

## Tech

- Web: Vite + React
- Server: Express
- DB: Postgres (Prisma)
- Jobs:
  - News: every 5 minutes
  - APY: hourly

## Live Demo

https://yieldnewshub-production.up.railway.app/

## Quickstart (local)

### 1) Start Postgres

```bash
docker compose up -d
```

### 2) Install deps

```bash
npm install
```

### 3) Configure env

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

### 4) Migrate DB

```bash
npm -w apps/server run prisma:migrate -- --name init
```

### 5) Run server

```bash
npm -w apps/server run dev
```

### 6) Run web

In a new terminal:
```bash
npm -w apps/web run dev
```

Open:
- Web: http://localhost:5173
- API: http://localhost:8787/healthz

## Notes

- **APY**: uses https://yields.llama.fi/pools and filters stable-ish pools by symbol and TVL.
- **News**: RSS sources are seeded on first run. Scoring is keyword-based MVP.
- **Telegram**: settings page stores bot token + chat id in DB (MVP, single global integration).

## Next

- Per-user Telegram integrations (auth)
- Better risk model (protocol audits, TVL changes, depeg risk)
- More reliable news sources + importance scoring
- Deploy to Railway + managed Postgres
