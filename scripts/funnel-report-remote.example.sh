#!/usr/bin/env bash
# Lead funnel report from VM1 (SSH + docker compose + optional raw copy for local runs).
#
# Setup once:
#   cp scripts/funnel-report-remote.example.sh scripts/funnel-report-remote.sh
#   chmod +x scripts/funnel-report-remote.sh
#   # edit SSH_TARGET if needed (default below)
#
# Usage:
#   ./scripts/funnel-report-remote.sh 2026-05-01 2026-05-31
#   PLACEMENT_BREAKDOWN=1 ./scripts/funnel-report-remote.sh 2026-05-01 2026-05-31
#
# Grab access log + click store to analytics/.remote-data/ (for local npm run funnel-report):
#   GRAB_RAW=1 ./scripts/funnel-report-remote.sh 2026-05-01 2026-05-31
#
# Env: SSH_TARGET, REMOTE_DIR, GRAB_RAW, PLACEMENT_BREAKDOWN, LOCAL_REPORT_DIR, LOCAL_DATA_DIR

set -euo pipefail

SSH_TARGET="${SSH_TARGET:-root@YOUR_SERVER_IP}"
REMOTE_DIR="${REMOTE_DIR:-/opt/Portfolio}"
GRAB_RAW="${GRAB_RAW:-0}"
PLACEMENT_BREAKDOWN="${PLACEMENT_BREAKDOWN:-0}"
LOCAL_REPORT_DIR="${LOCAL_REPORT_DIR:-.local/funnel-reports}"
LOCAL_DATA_DIR="${LOCAL_DATA_DIR:-analytics/.remote-data}"

FUNNEL_FROM="${1:-${FUNNEL_FROM:-}}"
FUNNEL_TO="${2:-${FUNNEL_TO:-}}"

if [[ "$SSH_TARGET" == *"YOUR_SERVER_IP"* ]]; then
  echo "Set SSH_TARGET (e.g. export SSH_TARGET=root@188.245.242.141) or edit this script." >&2
  exit 1
fi

if [[ ! "$FUNNEL_FROM" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] ||
  [[ ! "$FUNNEL_TO" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  echo "Usage: $0 FROM_DATE TO_DATE   (YYYY-MM-DD)" >&2
  exit 1
fi

REPORT_FILE="${LOCAL_REPORT_DIR}/funnel-${FUNNEL_FROM}_${FUNNEL_TO}.tsv"
mkdir -p "$LOCAL_REPORT_DIR"
if [[ "$GRAB_RAW" == "1" ]]; then
  mkdir -p "$LOCAL_DATA_DIR"
fi

EXTRA_ARGS=()
if [[ "$PLACEMENT_BREAKDOWN" == "1" ]]; then
  EXTRA_ARGS+=(--placement-breakdown)
fi

echo "Funnel report → ${SSH_TARGET}:${REMOTE_DIR} (${FUNNEL_FROM} … ${FUNNEL_TO})"

ssh "$SSH_TARGET" bash -s <<REMOTE
set -euo pipefail
REMOTE_DIR="${REMOTE_DIR}"
FUNNEL_FROM="${FUNNEL_FROM}"
FUNNEL_TO="${FUNNEL_TO}"
GRAB_RAW="${GRAB_RAW}"
PLACEMENT_BREAKDOWN="${PLACEMENT_BREAKDOWN}"

cd "\${REMOTE_DIR}"

if [[ ! -f docker-compose.yml ]]; then
  echo "Missing \${REMOTE_DIR}/docker-compose.yml — deploy the repo first." >&2
  exit 1
fi

LOG_VOL="\$(docker volume ls -q --filter name=caddy_logs | head -1)"
if [[ -z "\${LOG_VOL}" ]]; then
  echo "No caddy_logs volume found — is Caddy logging enabled?" >&2
  exit 1
fi

ANALYTICS_VOL="\$(docker volume ls -q --filter name=analytics_data | head -1)"
if [[ -z "\${ANALYTICS_VOL}" ]]; then
  echo "No analytics_data volume found — is the analytics service deployed?" >&2
  exit 1
fi

SNAP="\${REMOTE_DIR}/.funnel-snapshot"
rm -rf "\${SNAP}"
mkdir -p "\${SNAP}"

if [[ "\${GRAB_RAW}" == "1" ]]; then
  docker compose run --rm --no-deps \
    -v "\${LOG_VOL}:/var/log/caddy:ro" \
    -v "\${ANALYTICS_VOL}:/data:ro" \
    -v "\${SNAP}:/out" \
    analytics sh -c 'cp /var/log/caddy/access*.log /out/ 2>/dev/null || :; cp /data/clicks.sqlite /out/clicks.sqlite 2>/dev/null || :'
  if ! compgen -G "\${SNAP}/access"*.log >/dev/null 2>&1; then
    echo "Could not copy access logs — check Caddy log path on the server." >&2
    exit 1
  fi
  if [[ ! -f "\${SNAP}/clicks.sqlite" ]]; then
    echo "Could not copy clicks.sqlite — is the analytics service running?" >&2
    exit 1
  fi
fi

PLACEMENT_FLAG=""
if [[ "\${PLACEMENT_BREAKDOWN}" == "1" ]]; then
  PLACEMENT_FLAG="--placement-breakdown"
fi

docker compose run --rm --no-deps \
  -v "\${LOG_VOL}:/var/log/caddy:ro" \
  -v "\${ANALYTICS_VOL}:/data:ro" \
  analytics node dist/funnel-report-cli.js \
  --from "\${FUNNEL_FROM}" \
  --to "\${FUNNEL_TO}" \
  --log '/var/log/caddy/access*.log' \
  \${PLACEMENT_FLAG}
REMOTE
  >"$REPORT_FILE"

echo "Saved report: ${REPORT_FILE}"
cat "$REPORT_FILE"

if [[ "$GRAB_RAW" == "1" ]]; then
  echo "Grabbing access logs and clicks.sqlite…"
  mkdir -p "${LOCAL_DATA_DIR}/caddy-logs"
  scp "${SSH_TARGET}:${REMOTE_DIR}/.funnel-snapshot/access*.log" \
    "${LOCAL_DATA_DIR}/caddy-logs/"
  scp "${SSH_TARGET}:${REMOTE_DIR}/.funnel-snapshot/clicks.sqlite" \
    "${LOCAL_DATA_DIR}/clicks.sqlite"
  ssh "$SSH_TARGET" "rm -rf ${REMOTE_DIR}/.funnel-snapshot"
  echo "Raw data: ${LOCAL_DATA_DIR}/"
  echo "Local report: cd analytics && npm run build && npm run funnel-report -- \\"
  echo "  --from ${FUNNEL_FROM} --to ${FUNNEL_TO} \\"
  echo "  --log '../${LOCAL_DATA_DIR}/caddy-logs/access*.log' --db ../${LOCAL_DATA_DIR}/clicks.sqlite"
fi
