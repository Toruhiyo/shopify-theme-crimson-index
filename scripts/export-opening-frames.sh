#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PLAYWRIGHT_MODULE="$(npm exec --yes --package=playwright -- node -p "require('url').pathToFileURL(require.resolve('playwright')).href")"
export PLAYWRIGHT_MODULE

exec node "$ROOT/scripts/export-opening-frames.mjs" "$@"
