#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PLAYWRIGHT_BIN="$(npm exec --yes --package=playwright -- which playwright)"
PLAYWRIGHT_MODULE="$(node -p "require('url').pathToFileURL(require('path').resolve(process.argv[1], '..', 'playwright', 'index.mjs')).href" "$(dirname "$PLAYWRIGHT_BIN")")"
export PLAYWRIGHT_MODULE

exec node "$ROOT/scripts/export-opening-frames.mjs" "$@"
