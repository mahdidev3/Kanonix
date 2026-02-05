# Arya Frontend (Kanonix)

RTL-first, production-ready React + TypeScript frontend for **Arya Kanoon** with strict tenant architecture and complete mock/real API support.

## Why Vite + React
- Fast local iteration and small DX overhead.
- Easy multi-tenant duplication by folder copy and tenant config swap.
- Fully compatible with React Query, Docker, and production static hosting.

## Tenant architecture
```
frontend/
  arya/                # Tenant-specific app root
    src/features/tenant/config.ts
    src/assets/images/
  shared/              # Shared building blocks for future tenants
```

All Arya-specific texts, slug, branding, and contacts are in `src/features/tenant/config.ts`.

## Environment modes
Create/use these files:
- `.env.development`
- `.env.staging`
- `.env.production`
- `.env.test`

Variables:
- `VITE_API_BASE_URL`
- `VITE_LOG_LEVEL`
- `VITE_ENABLE_MOCK_API`
- `VITE_ENABLE_DEV_PAYMENT_SIM`
- `VITE_ENABLE_ADMIN_UI`

## Run locally
### Mock mode (no backend)
```bash
npm install
npm run dev
```
`VITE_ENABLE_MOCK_API=true` in development env makes all pages fully functional offline.

### Real backend mode
1. Set `VITE_ENABLE_MOCK_API=false`.
2. Set `VITE_API_BASE_URL=http://localhost:8000`.
3. Run backend and frontend.

> API client auto-injects `X-KANOON-SLUG: arya` on every request.

## Production
```bash
npm run build
npm run preview
```
Docker production image serves `/dist` via nginx.

## Docker
- Frontend-only compose: `docker-compose.frontend.yml`
- Fullstack compose: `docker-compose.fullstack.yml`

## UI coverage
Implemented routes:
- `/`
- `/about`
- `/events`
- `/events/:id`
- `/auth/login`, `/auth/register` (without site header/footer)
- `/dashboard`
- `/checkout/:type/:id` (festival/trip/market)
- `/gallery`, `/gallery/:id`
- `/admin`
- `/ui-preview`
- `*` -> 404

## UI Preview
`/ui-preview` showcases typography, colors, hero, event cards, seat map states, checkout/auth forms, dashboard widgets, and admin reports, fully powered by mock mode.

## Asset replacement guide
Replace files under:
- `src/assets/images/arya-logo.svg`
- `src/assets/images/hero-arya.svg`
- `src/assets/images/poster-*.svg`
- `src/assets/images/gallery-*.svg`

Keep same filenames or update `src/features/tenant/config.ts` and mock fixtures.

## Add a new tenant frontend (step-by-step)
1. Copy `frontend/arya` to `frontend/<new-slug>`.
2. Update `src/features/tenant/config.ts` (name, slug, colors, assets, contacts).
3. Replace images in `src/assets/images/`.
4. Adjust mock fixtures in `src/features/mock/data.ts`.
5. Change env files (`VITE_API_BASE_URL`, flags, port).
6. Run `npm install && npm run dev` inside new tenant folder.
7. Optional: expose in root scripts/CI and add dedicated docker compose file.

## Quality
- ESLint + Prettier enabled.
- ErrorBoundary and 404 page included.
- React Query caching + centralized API client with retry/401 handling.
