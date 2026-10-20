#!/usr/bin/env bash
set -Eeuo pipefail

SERVER_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
API_SERVER="$SERVER_DIR/api-proxy.mjs"

if ! command -v node >/dev/null 2>&1; then
  printf 'Node.js 22.17 or newer is required.\n' >&2
  exit 1
fi

NODE_VERSION="$(node -p 'process.versions.node')"
IFS=. read -r NODE_MAJOR NODE_MINOR _ <<< "$NODE_VERSION"

if ((NODE_MAJOR < 22 || (NODE_MAJOR == 22 && NODE_MINOR < 17))); then
  printf 'Node.js 22.17 or newer is required; found v%s.\n' "$NODE_VERSION" >&2
  exit 1
fi

if [[ ! -f "$API_SERVER" ]]; then
  printf 'API server file not found: %s\n' "$API_SERVER" >&2
  exit 1
fi

export HOST="${HOST:-127.0.0.1}"
export PORT="${PORT:-8787}"

exec node "$API_SERVER"
