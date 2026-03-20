#!/usr/bin/env bash
# Start Hugo dev server with live reload (localhost:1313)
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose up hugo
