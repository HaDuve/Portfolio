# Inlined into scripts/deploy-remote.example.sh remote SSH block via $(cat …).
# Variables expand on the laptop when the heredoc is built — do not escape $ here
# (escaped \$ survives $(cat) and breaks remote checks; see Portfolio deploy body).
# Operator automation (HaDuve/n8n) — separate compose project at REMOTE_N8N_DIR.
# Enable with: DEPLOY_N8N=1 ./scripts/deploy-remote.sh

bootstrap_n8n_repo() {
  if [[ "${DEPLOY_N8N}" != "1" ]]; then
    return 0
  fi
  if [[ -d "${REMOTE_N8N_DIR}/.git" ]]; then
    return 0
  fi
  echo "Cloning ${N8N_REPO_URL} → ${REMOTE_N8N_DIR}…"
  mkdir -p "$(dirname "${REMOTE_N8N_DIR}")"
  git clone --branch "${DEPLOY_BRANCH}" "${N8N_REPO_URL}" "${REMOTE_N8N_DIR}"
}

ensure_n8n_env() {
  if [[ "${DEPLOY_N8N}" != "1" ]]; then
    return 0
  fi
  cd "${REMOTE_N8N_DIR}"
  if [[ ! -f .env ]]; then
    if [[ ! -f .env.prod.example ]]; then
      echo "Missing .env.prod.example in ${REMOTE_N8N_DIR} — pull latest n8n main." >&2
      return 1
    fi
    echo "Creating ${REMOTE_N8N_DIR}/.env from .env.prod.example…"
    umask 077
    cp .env.prod.example .env
    chmod 600 .env
    echo "Created ${REMOTE_N8N_DIR}/.env — fill secrets on VM, then re-run DEPLOY_N8N=1."
    return 1
  fi
  if ! grep -qE '^DISCORD_BOOKING_ALERT_WEBHOOK_URL=.+' .env \
    || ! grep -qE '^CALENDLY_PERSONAL_ACCESS_TOKEN=.+' .env \
    || ! grep -qE '^WEBHOOK_URL=.+' .env; then
    echo "Secrets missing in ${REMOTE_N8N_DIR}/.env — fill and re-run DEPLOY_N8N=1." >&2
    return 1
  fi
  return 0
}

sync_n8n_code() {
  if [[ "${DEPLOY_N8N}" != "1" ]]; then
    return 0
  fi
  cd "${REMOTE_N8N_DIR}"
  git fetch origin "${DEPLOY_BRANCH}"
  git checkout "${DEPLOY_BRANCH}"
  git pull origin "${DEPLOY_BRANCH}"
}

build_n8n_workflow() {
  cd "${REMOTE_N8N_DIR}"
  docker run --rm \
    -v "${REMOTE_N8N_DIR}:/app" \
    -w /app \
    --env-file .env \
    node:22-bookworm-slim \
    bash -lc "npm ci && npm run build:workflow && npm run check:prod-stack"
}

deploy_n8n_compose() {
  cd "${REMOTE_N8N_DIR}"
  docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
  docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
}

deploy_n8n_stack() {
  if [[ "${DEPLOY_N8N}" != "1" ]]; then
    return 0
  fi
  echo "Deploy n8n → ${REMOTE_N8N_DIR} (origin/${DEPLOY_BRANCH})"
  bootstrap_n8n_repo
  if ! ensure_n8n_env; then
    echo "n8n bootstrap paused — ${REMOTE_N8N_DIR} exists; fill .env and re-run DEPLOY_N8N=1."
    return 0
  fi
  sync_n8n_code
  build_n8n_workflow
  deploy_n8n_compose
  echo "n8n running on 127.0.0.1:5678 (localhost only). UI: ssh -L 5678:127.0.0.1:5678 ${SSH_USER_HOST:-user@vm}"
}
