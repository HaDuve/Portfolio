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

If you already have the repo set up on the server (in `REMOTE_DIR`), you can deploy from your local machine via:

```bash
# optional:
# export REMOTE_DIR=/opt/Portfolio
# export DEPLOY_BRANCH=main
./scripts/deploy-remote.sh
```

1. Clone this repo on the server and `cd` into the project root (where `docker-compose.yml` lives).

2. Build static files into the Docker volume and start Caddy:

   ```bash
   docker compose run --build --rm frontend
   docker compose up -d caddy
   ```

3. After you change JSON or frontend code, rebuild and refresh files in the volume:

   ```bash
   docker compose run --build --rm frontend
   ```

   `--build` ensures the image includes your latest `git pull`; without it, the container can still build from an old image layer. Caddy serves updated files from the volume; restarting Caddy is usually unnecessary.

4. Optional `www`: add a CNAME from `www` to `hannesduve.com`, then add a second site block in `caddy/Caddyfile` for `www.hannesduve.com` with `redir` to the apex or duplicate `root` / `file_server` as you prefer.

## VM2 (database)

No database for this static stack. If you add PostgreSQL later, run it on a separate VM and restrict access to the app VM only.

## References

- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [Compose file](https://compose-spec.github.io/compose-spec/03-compose-file.html)
- [Caddy automatic HTTPS](https://caddyserver.com/docs/automatic-https)
