#!/usr/bin/env bash
# Build di produzione in docs/ (stesso output del deploy: hugo --minify).
# Usa hugo locale se installato, altrimenti il container pinnato.
set -euo pipefail
cd "$(dirname "$0")/.."
if command -v hugo >/dev/null 2>&1; then
  hugo --minify --cleanDestinationDir
else
  docker compose run --rm hugo hugo --minify --cleanDestinationDir
fi
