#!/usr/bin/env bash
# Build static site into docs/
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf docs/*
docker compose run --rm hugo hugo --minify=false
