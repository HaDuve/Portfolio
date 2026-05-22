#!/usr/bin/env bash
# One-command deploy from your laptop → VM1 (SSH + git/rsync + docker compose).
#
# Setup once:
#   cp scripts/deploy-remote.example.sh scripts/deploy-remote.sh
#   chmod +x scripts/deploy-remote.sh
#   # edit SSH_TARGET if needed (default below)
#
# Usage:
#   ./scripts/deploy-remote.sh              # git pull on server, rebuild site, up caddy+analytics
#   SYNC_LOCAL=1 ./scripts/deploy-remote.sh   # rsync this repo instead of git pull (unpushed work)
#   PRUNE_CLICKS=1 ./scripts/deploy-remote.sh # also prune click store >12 months
#
# Env: SSH_TARGET, REMOTE_DIR, DEPLOY_BRANCH, REPO_URL, SYNC_LOCAL, PRUNE_CLICKS

set -euo pipefail

SSH_TARGET="${SSH_TARGET:-root@YOUR_SERVER_IP}"
REMOTE_DIR="${REMOTE_DIR:-/opt/Portfolio}"
BRANCH="${DEPLOY_BRANCH:-main}"
REPO_URL="${REPO_URL:-https://github.com/HaDuve/Portfolio.git}"
SYNC_LOCAL="${SYNC_LOCAL:-0}"
PRUNE_CLICKS="${PRUNE_CLICKS:-0}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ "$SSH_TARGET" == *"YOUR_SERVER_IP"* ]]; then
  echo "Set SSH_TARGET (e.g. export SSH_TARGET=root@188.245.242.141) or edit this script." >&2
  exit 1
fi

echo "Deploy → ${SSH_TARGET}:${REMOTE_DIR} (branch: ${BRANCH}, sync_local: ${SYNC_LOCAL})"

if [[ "$SYNC_LOCAL" == "1" ]]; then
  echo "Rsync local tree (excludes node_modules, build artifacts, .env)…"
  rsync -avz --delete \
    --exclude node_modules \
    --exclude frontend/node_modules \
    --exclude frontend/.next \
    --exclude frontend/out \
    --exclude analytics/node_modules \
    --exclude .env \
    --exclude .git \
    "${ROOT}/" "${SSH_TARGET}:${REMOTE_DIR}/"
fi

ssh "$SSH_TARGET" bash -s <<REMOTE
set -euo pipefail
REMOTE_DIR="${REMOTE_DIR}"
BRANCH="${BRANCH}"
REPO_URL="${REPO_URL}"
SYNC_LOCAL="${SYNC_LOCAL}"
PRUNE_CLICKS="${PRUNE_CLICKS}"

bootstrap_repo() {
  if [[ -d "\${REMOTE_DIR}/.git" ]]; then
    return 0
  fi
  echo "Cloning \${REPO_URL} → \${REMOTE_DIR}…"
  mkdir -p "\$(dirname "\${REMOTE_DIR}")"
  git clone "\${REPO_URL}" "\${REMOTE_DIR}"
}

ensure_env() {
  cd "\${REMOTE_DIR}"
  if [[ -f .env ]]; then
    return 0
  fi
  echo "Creating .env (analytics secrets)…"
  umask 077
  INGEST_SECRET=\$(openssl rand -hex 32)
  IP_HASH_SALT=\$(openssl rand -hex 32)
  cat > .env <<EOF
ANALYTICS_INGEST_SECRET=\${INGEST_SECRET}
ANALYTICS_IP_HASH_SALT=\${IP_HASH_SALT}
EOF
  chmod 600 .env
  echo "Saved new secrets in \${REMOTE_DIR}/.env — back them up somewhere safe."
}

sync_code() {
  cd "\${REMOTE_DIR}"
  if [[ "\${SYNC_LOCAL}" == "1" ]]; then
    echo "Using rsynced tree (skipping git pull)."
    return 0
  fi
  git fetch origin "\${BRANCH}"
  git checkout "\${BRANCH}"
  git pull origin "\${BRANCH}"
}

deploy_compose() {
  cd "\${REMOTE_DIR}"
  docker compose run --build --rm frontend
  docker compose up -d --build caddy analytics
  if [[ "\${PRUNE_CLICKS}" == "1" ]]; then
    docker compose run --rm analytics node dist/prune-clicks.js
  fi
  docker compose ps
}

bootstrap_repo
ensure_env
sync_code
deploy_compose
echo "Deploy finished."
REMOTE

echo "Done. Site: https://hannesduve.com"
