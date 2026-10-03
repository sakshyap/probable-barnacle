# probable-barnacle

This repository contains two projects:

## 1. Portfolio & Admin Panel (root)

Node/Express + Vite/React admin panel and portfolio site, backed by Supabase.

- `server.js` - Express entry point
- `routes/` - API routes (auth, portfolio, students, courses, blog)
- `middleware/` - auth and Supabase session middleware
- `data/` - data access layer (`supabase.js`, JSON fallbacks)
- `public/` - static assets and dashboard scripts
- `supabase/schema.sql` - database schema
- `render.yaml` - Render deployment blueprint

Setup:

```bash
npm install
cp .env.example .env   # then fill in SUPABASE_* values
npm run seed           # create the first admin user
npm run migrate        # import existing JSON data into Supabase
npm run dev
```

Deploy: create a Render Blueprint from this repository. `SUPABASE_URL`,
`SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are prompted on first
deploy and stored as encrypted environment variables.

## 2. School Website (`artifacts/`)

Replit-based pnpm/TypeScript monorepo with the school website and its mockup
sandbox. See `SEO.md` for search-related notes.

```bash
pnpm install
pnpm run build
```