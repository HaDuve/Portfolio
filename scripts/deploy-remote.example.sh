#!/usr/bin/env bash
# Deploy merged main from GitHub → VM1 (SSH + git pull + docker compose).
#
# Setup once:
#   cp scripts/deploy-remote.example.sh scripts/deploy-remote.sh
#   chmod +x scripts/deploy-remote.sh
#   # edit SSH_TARGET if needed (default below)
#
# Usage (after PR is merged to main):
#   ./scripts/deploy-remote.sh
#   PRUNE_CLICKS=1 ./scripts/deploy-remote.sh
#
# Env: SSH_TARGET, REMOTE_DIR, REPO_URL, PRUNE_CLICKS

set -euo pipefail

SSH_TARGET="${SSH_TARGET:-root@YOUR_SERVER_IP}"
REMOTE_DIR="${REMOTE_DIR:-/opt/Portfolio}"
REPO_URL="${REPO_URL:-https://github.com/HaDuve/Portfolio.git}"
PRUNE_CLICKS="${PRUNE_CLICKS:-0}"
DEPLOY_BRANCH="main"

if [[ "$SSH_TARGET" == *"YOUR_SERVER_IP"* ]]; then
  echo "Set SSH_TARGET (e.g. export SSH_TARGET=root@188.245.242.141) or edit this script." >&2
  exit 1
fi

echo "Deploy → ${SSH_TARGET}:${REMOTE_DIR} (origin/${DEPLOY_BRANCH})"

ssh "$SSH_TARGET" bash -s <<REMOTE
set -euo pipefail
REMOTE_DIR="${REMOTE_DIR}"
REPO_URL="${REPO_URL}"
PRUNE_CLICKS="${PRUNE_CLICKS}"
DEPLOY_BRANCH="${DEPLOY_BRANCH}"

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
