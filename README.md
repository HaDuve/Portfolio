# Dev portfolio (Next.js + Docker + Caddy)

Static Next.js site (`output: "export"`) with Tailwind CSS v4, served by Caddy on a Hetzner VM. Content lives in `frontend/src/data/*.json`.

## Local development

```bash
cd frontend
npm install
npm run dev
```

Build static export locally:

```bash
cd frontend
npm run build
# output: frontend/out
```

## Edit content

- Profile & social: `frontend/src/data/profile.json`
- Projects: `frontend/src/data/projects.json`
- Skills: `frontend/src/data/skills.json`

## Deploy on VM1 (app server)

**Policy:** deploy only code that is **merged to `main` on GitHub** (after PR review). The deploy script pulls `origin/main` on the server; it does not rsync your laptop or deploy feature branches.

**Assumptions:** Ubuntu 22.04, Docker Engine + Compose v2, ports 80/443 open, DNS A record for `hannesduve.com` → server IP.

### One-command deploy (from your laptop)

```bash
cp scripts/deploy-remote.example.sh scripts/deploy-remote.sh   # once
chmod +x scripts/deploy-remote.sh
# optional: export SSH_TARGET=root@YOUR_IP REMOTE_DIR=/opt/Portfolio
./scripts/deploy-remote.sh
```

On each run the script (over SSH):

1. Clones `https://github.com/HaDuve/Portfolio` into `/opt/Portfolio` on first deploy
2. Creates `/opt/Portfolio/.env` with `ANALYTICS_INGEST_SECRET` and `ANALYTICS_IP_HASH_SALT` if missing (see `.env.example`; never commit `.env`)
3. `git pull origin main`
4. `docker compose run --build --rm frontend` — static export into the `site_data` volume (ingest key baked in at build time)
5. `docker compose up -d --build caddy analytics`

Also available via `cd frontend && npm run deploy`.

### Manual deploy on the server

If you prefer to run Compose on the VM directly (same result as the script’s remote steps):

```bash
cd /opt/Portfolio   # or your REMOTE_DIR
git pull origin main
docker compose run --build --rm frontend
docker compose up -d --build caddy analytics
```

After content-only changes, rebuilding `frontend` is usually enough; Caddy picks up files from the volume without a restart.

### Server environment (`.env`)

| Variable | Where | Purpose |
| --- | --- | --- |
| `ANALYTICS_INGEST_SECRET` | Server `.env` + baked into static build as `NEXT_PUBLIC_ANALYTICS_INGEST_KEY` | Shared ingest credential (deters noise; not secret from a motivated attacker) |
| `ANALYTICS_IP_HASH_SALT` | Server `.env` only | Salt for pseudonymous visitor key (no raw IP in SQLite) |

Generate once on first deploy (the script does this) or copy from `.env.example` and fill with `openssl rand -hex 32`.

### Click telemetry retention (prune)

Scheduling clicks are stored in SQLite on the `analytics_data` volume. Per [ADR-0003](docs/adr/0003-app-server-analytics.md), **analytics retention** is **12 months** — older rows should be deleted.

**Normal deploys do not prune.** Run retention separately (e.g. monthly), not on every site update:

```bash
# From laptop (deploy script + prune in one SSH session)
PRUNE_CLICKS=1 ./scripts/deploy-remote.sh

# Or on the server only
cd /opt/Portfolio
docker compose run --rm analytics node dist/prune-clicks.js
```

Example monthly cron on the server (`crontab -e`):

```cron
0 3 1 * * cd /opt/Portfolio && docker compose run --rm analytics node dist/prune-clicks.js >> /var/log/portfolio-prune.log 2>&1
```

Caddy access logs used for page-view funnel analysis are rotated in `caddy/Caddyfile` (`roll_keep_for 8760h` ≈ 12 months).

### Optional `www`

Add a CNAME from `www` to `hannesduve.com`, then add a site block in `caddy/Caddyfile` for `www.hannesduve.com` with `redir` to the apex or duplicate `root` / `file_server`.

## VM2 (database)

No database for this static stack. Click telemetry uses SQLite on VM1. If you add PostgreSQL later, run it on a separate VM and restrict access to the app VM only.

## References

- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [Compose file](https://compose-spec.github.io/compose-spec/03-compose-file.html)
- [Caddy automatic HTTPS](https://caddyserver.com/docs/automatic-https)
- App-server analytics: `docs/adr/0003-app-server-analytics.md`, `CONTEXT.md` (Measurement)
