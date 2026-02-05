# Kanonix Backend

Production-grade multi-tenant backend for university student organizations (Kanoons), using tenant header isolation (`X-KANOON-SLUG`).

## Architecture
- **FastAPI async API** with ORJSON responses
- **PostgreSQL + SQLAlchemy 2 async + asyncpg**
- **Alembic migrations**
- **Redis** for caching/rate limiting/readiness checks
- **Structlog** with correlation IDs
- **Prometheus metrics** via `/metrics`
- **S3-compatible storage** (MinIO) or local file storage

## Tenant Isolation
All tenant data is partitioned by `kanoon_id`. Tenant is resolved using request header:

```http
X-KANOON-SLUG: arya
```

Every query in routers includes tenant filters.

## Modules Included
- Auth/users with JWT access+refresh, password hashing, profile APIs
- Kanoon management settings
- Council member model
- Event management with filters/pagination
- Orders/payments with mock payment flow and trip subsidy calculations
- Festival seat reservation with atomic lock (`SELECT ... FOR UPDATE`) and expiry release endpoint
- Market booth request + admin approval/rejection
- Gallery uploads (MinIO/local)
- Reviews with paid+done enforcement
- Admin reports + CSV export
- Health/readiness/metrics

## Environment Modes
Supported files:
- `.env.development`
- `.env.staging`
- `.env.production`
- `.env.test`

Mode controls logging format, debug flags, Swagger, CORS, cache TTL, rate limits, workers, and security flags.

## Run in Development
```bash
cp .env.development .env
docker compose up --build -d
docker compose run --rm api alembic upgrade head
docker compose run --rm api python scripts/seed.py
```

API URL: `http://localhost:8000`

## Production Runtime
```bash
cp .env.production .env
docker compose up --build -d api-prod postgres redis minio
docker compose run --rm api-prod alembic upgrade head
```

Gunicorn/Uvicorn worker mode is used in `api-prod`.

## Seeded Bootstrap Data
Seed script creates:
- Sample kanoon `arya`
- Superadmin `admin@arya.local` / `Admin@12345`
- Halls: Sheikh-Bahaei, Fotouhi, Honar Hall, Mofakher Hall
- Basic seat maps (A-C rows, 1-5 columns)
- Sample festival/trip/market events

## Setup Automation
```bash
./setup.sh <git-url> <mode>
```
This validates dependencies, clones repo, activates env, runs containers, migrations, and seed data.

## Testing
```bash
pip install -e .[test]
pytest
```
Test coverage includes auth, event schema creation, seat reservation expiration logic, review permission rule, market booth rule checks, and trip subsidy calculations.

## Key Endpoints
- `GET /healthz`
- `GET /readyz`
- `GET /metrics`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/events`
- `POST /api/v1/orders/reserve-seat`
- `POST /api/v1/orders/trip`
- `POST /api/v1/market/booth`
- `POST /api/v1/reviews`
- `GET /api/v1/admin/reports/sales.csv`
