Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Set-Location frontend/arya
npm install
if (-Not (Test-Path .env.local)) { Copy-Item .env.development .env.local }
Write-Host 'Frontend setup complete. Run: cd frontend/arya; npm run dev'
