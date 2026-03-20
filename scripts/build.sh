#!/usr/bin/env bash
# Build static site into docs/
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose run --rm hugo hugo --minify=false
