#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

exec npm exec --yes --package=playwright -- node "$ROOT/scripts/export-opening-frames.mjs" "$@"
