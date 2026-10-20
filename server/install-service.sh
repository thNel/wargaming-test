#!/usr/bin/env bash
set -Eeuo pipefail

SERVICE_NAME="wows-api"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
SERVER_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
START_SCRIPT="${SERVER_DIR}/start.sh"
API_SERVER="${SERVER_DIR}/api-proxy.mjs"
SYSTEM_PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

fail() {
  printf 'Error: %s\n' "$1" >&2
  exit 1
}

if ((EUID != 0)); then
  fail "Run this installer as root: sudo bash '${BASH_SOURCE[0]}'"
fi

[[ -f "$START_SCRIPT" ]] || fail "start.sh was not found beside this installer: ${START_SCRIPT}"
[[ -f "$API_SERVER" ]] || fail "api-proxy.mjs was not found beside this installer: ${API_SERVER}"
command -v systemctl >/dev/null 2>&1 || fail "systemctl was not found; this installer requires systemd."
command -v curl >/dev/null 2>&1 || fail "curl was not found; it is required for the post-start health check."
[[ "$(ps -p 1 -o comm= | tr -d ' ')" == "systemd" ]] || fail "PID 1 is not systemd."

NODE_BIN="$(command -v node || true)"
[[ -n "$NODE_BIN" ]] || fail "Node.js 22.17 or newer was not found in PATH."
NODE_VERSION="$("$NODE_BIN" -p 'process.versions.node')"
IFS=. read -r NODE_MAJOR NODE_MINOR _ <<< "$NODE_VERSION"
if ((NODE_MAJOR < 22 || (NODE_MAJOR == 22 && NODE_MINOR < 17))); then
  fail "Node.js 22.17 or newer is required; found v${NODE_VERSION}."
fi

NODE_DIR="$(dirname -- "$(readlink -f -- "$NODE_BIN")")"
case "$NODE_DIR" in
  /root/*|/home/*)
    fail "Node.js is installed inside a user's home directory (${NODE_DIR}). Install Node.js system-wide, then rerun this command."
    ;;
esac

case "$SERVER_DIR" in
  *" "*|*$'\t'*|*\\*|*\"*) fail "The server directory path cannot contain spaces, backslashes, or quotes: ${SERVER_DIR}" ;;
esac

cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=World of Warships Vortex API proxy
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
DynamicUser=true
WorkingDirectory=${SERVER_DIR}
Environment=HOST=127.0.0.1
Environment=PORT=8787
Environment=PATH=${NODE_DIR}:${SYSTEM_PATH}
ExecStart=/bin/bash ${START_SCRIPT}
Restart=on-failure
RestartSec=3s
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX

[Install]
WantedBy=multi-user.target
EOF

chmod 0644 "$SERVICE_FILE"
systemctl daemon-reload
systemctl enable "$SERVICE_NAME.service"
if systemctl is-active --quiet "$SERVICE_NAME.service"; then
  systemctl restart "$SERVICE_NAME.service"
else
  systemctl start "$SERVICE_NAME.service"
fi

systemctl --no-pager --full status "$SERVICE_NAME.service"
printf '\nHealth check: '
for attempt in {1..10}; do
  if curl --fail --silent http://127.0.0.1:8787/health; then
    printf '\n'
    exit 0
  fi
  sleep 1
done

printf '\nHealth check failed. Recent service logs:\n' >&2
journalctl -u "$SERVICE_NAME.service" -n 50 --no-pager >&2
exit 1
