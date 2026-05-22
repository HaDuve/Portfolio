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

Assumptions: Ubuntu 22.04, Docker Engine + Docker Compose v2, ports 80 and 443 open, DNS A record for `hannesduve.com` points to this server’s public IP.

From your laptop, **after the PR is merged to `main`** on GitHub (Docker on the server is enough — no manual clone/.env steps):

```bash
cp scripts/deploy-remote.example.sh scripts/deploy-remote.sh   # once
chmod +x scripts/deploy-remote.sh
# optional: export SSH_TARGET=root@YOUR_IP REMOTE_DIR=/opt/Portfolio
./scripts/deploy-remote.sh
```

The script clones into `REMOTE_DIR` (default `/opt/Portfolio`) on first run, creates `.env` with analytics secrets if missing, `git pull origin main`, builds the static site into the volume, and starts `caddy` + `analytics`. It does not rsync local trees or deploy feature branches.

1. Clone this repo on the server and `cd` into the project root (where `docker-compose.yml` lives).

2. On the server, create a `.env` from `.env.example` with `ANALYTICS_INGEST_SECRET` and `ANALYTICS_IP_HASH_SALT` (long random strings; never commit `.env`). The same secret is baked into the static export as `NEXT_PUBLIC_ANALYTICS_INGEST_KEY` when you build `frontend`.

3. Build static files into the Docker volume and start Caddy + analytics ingest:

   ```bash
   docker compose run --build --rm frontend
   docker compose up -d caddy analytics
   ```

4. After you change JSON or frontend code, rebuild and refresh files in the volume:

   ```bash
   docker compose run --build --rm frontend
   ```

   `--build` ensures the image includes your latest `git pull`; without it, the container can still build from an old image layer. Caddy serves updated files from the volume; restarting Caddy is usually unnecessary.

5. Prune click telemetry older than 12 months (e.g. monthly cron on the server):

   ```bash
   docker compose run --rm analytics node dist/prune-clicks.js
   ```

6. Optional `www`: add a CNAME from `www` to `hannesduve.com`, then add a second site block in `caddy/Caddyfile` for `www.hannesduve.com` with `redir` to the apex or duplicate `root` / `file_server` as you prefer.

## VM2 (database)

No database for this static stack. If you add PostgreSQL later, run it on a separate VM and restrict access to the app VM only.

## References

- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [Compose file](https://compose-spec.github.io/compose-spec/03-compose-file.html)
- [Caddy automatic HTTPS](https://caddyserver.com/docs/automatic-https)
