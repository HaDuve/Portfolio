#!/usr/bin/env bash
# Deploy merged main from GitHub → VM1 (SSH + git pull + docker compose).
#
# Setup once:
#   cp scripts/deploy-remote.example.sh scripts/deploy-remote.sh
#   chmod +x scripts/deploy-remote.sh
#   # edit SSH_TARGET if needed (default below)
#
# Usage (after PR is merged to main on GitHub):
#   ./scripts/deploy-remote.sh
#
# Optional — delete scheduling-click rows older than 12 months (run monthly, not every deploy):
#   PRUNE_CLICKS=1 ./scripts/deploy-remote.sh
#
# Optional — deploy operator automation (HaDuve/n8n) alongside the site (separate /opt/n8n compose):
#   DEPLOY_N8N=1 ./scripts/deploy-remote.sh
#
# Validate syntax: bash -n scripts/deploy-remote.example.sh scripts/lib/deploy-n8n-remote.sh
#
# Env: SSH_TARGET, REMOTE_DIR, REPO_URL, PRUNE_CLICKS, DEPLOY_N8N, REMOTE_N8N_DIR, N8N_REPO_URL

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SSH_TARGET="${SSH_TARGET:-root@YOUR_SERVER_IP}"
REMOTE_DIR="${REMOTE_DIR:-/opt/Portfolio}"
REPO_URL="${REPO_URL:-https://github.com/HaDuve/Portfolio.git}"
REMOTE_N8N_DIR="${REMOTE_N8N_DIR:-/opt/n8n}"
N8N_REPO_URL="${N8N_REPO_URL:-https://github.com/HaDuve/n8n.git}"
PRUNE_CLICKS="${PRUNE_CLICKS:-0}"
DEPLOY_N8N="${DEPLOY_N8N:-0}"
DEPLOY_BRANCH="main"

if [[ "$SSH_TARGET" == *"YOUR_SERVER_IP"* ]]; then
  echo "Set SSH_TARGET (e.g. export SSH_TARGET=root@188.245.242.141) or edit this script." >&2
  exit 1
fi

echo "Deploy → ${SSH_TARGET}:${REMOTE_DIR} (origin/${DEPLOY_BRANCH})"
if [[ "$DEPLOY_N8N" == "1" ]]; then
  echo "Also deploying n8n → ${REMOTE_N8N_DIR}"
fi

ssh "$SSH_TARGET" bash -s <<REMOTE
set -euo pipefail
REMOTE_DIR="${REMOTE_DIR}"
REPO_URL="${REPO_URL}"
PRUNE_CLICKS="${PRUNE_CLICKS}"
DEPLOY_N8N="${DEPLOY_N8N}"
REMOTE_N8N_DIR="${REMOTE_N8N_DIR}"
N8N_REPO_URL="${N8N_REPO_URL}"
DEPLOY_BRANCH="${DEPLOY_BRANCH}"

$(cat "${ROOT}/scripts/lib/deploy-n8n-remote.sh")

bootstrap_repo() {
  if [[ -d "\${REMOTE_DIR}/.git" ]]; then
    return 0
  fi
  echo "Cloning \${REPO_URL} → \${REMOTE_DIR}…"
  mkdir -p "\$(dirname "\${REMOTE_DIR}")"
  git clone --branch "\${DEPLOY_BRANCH}" "\${REPO_URL}" "\${REMOTE_DIR}"
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
  git fetch origin "\${DEPLOY_BRANCH}"
  git checkout "\${DEPLOY_BRANCH}"
  git pull origin "\${DEPLOY_BRANCH}"
}

deploy_compose() {
  cd "\${REMOTE_DIR}"
  docker compose run --build --rm frontend
  docker compose up -d --build caddy analytics
  # Caddyfile is bind-mounted; restart so log/output changes apply without a stale process.
  docker compose restart caddy
  if [[ "\${PRUNE_CLICKS}" == "1" ]]; then
    docker compose run --rm analytics node dist/prune-clicks.js
  fi
  docker compose ps
}

bootstrap_repo
ensure_env
sync_code
deploy_compose
deploy_n8n_stack
echo "Deploy finished."
REMOTE

echo "Done. Site: https://hannesduve.com"
if [[ "$DEPLOY_N8N" == "1" ]]; then
  echo "n8n: ${REMOTE_N8N_DIR} (127.0.0.1:5678 — SSH tunnel for UI)"
fi
