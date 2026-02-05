#!/usr/bin/env bash
set -euo pipefail

if ! command -v docker >/dev/null; then echo "docker missing"; exit 1; fi
if ! docker compose version >/dev/null 2>&1; then echo "docker compose missing"; exit 1; fi
if ! command -v git >/dev/null; then echo "git missing"; exit 1; fi

REPO_URL="${1:-}"; MODE="${2:-development}"
if [[ -z "$REPO_URL" ]]; then
  echo "Usage: ./setup.sh <git-url> <development|staging|production|test>"
  exit 1
fi

DIR="$(basename "$REPO_URL" .git)"
if [[ ! -d "$DIR" ]]; then git clone "$REPO_URL"; fi
cd "$DIR"
cp ".env.${MODE}" .env

docker compose up --build -d postgres redis minio api
sleep 8
docker compose run --rm api alembic upgrade head
docker compose run --rm api python scripts/seed.py

echo "API: http://localhost:8000"
echo "Health: http://localhost:8000/healthz"
echo "Ready: http://localhost:8000/readyz"
curl -fsS http://localhost:8000/healthz || true
