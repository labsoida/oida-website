#!/usr/bin/env bash
# Build and serve with Hugo dev server (localhost:1313)
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose run --rm hugo hugo --minify=false
docker compose up hugo
