#!/usr/bin/env bash
set -euo pipefail
cd frontend/arya
npm install
cp -n .env.development .env.local || true
echo "Frontend setup complete. Run: cd frontend/arya && npm run dev"
