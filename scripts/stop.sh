#!/usr/bin/env bash
# Stop all containers
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose down
