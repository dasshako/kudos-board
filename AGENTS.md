# Notes for agents

## Architecture
- `web` (Vite dev server, host port 3000) proxies `/api` to `api` over the Compose
  network (`http://api:8000`). Keep the single-origin wiring: the front end calls
  relative `/api/...` URLs only.
- `api` is plain ESM JavaScript (no build step) using `better-sqlite3`. Schema and
  seed live in `api/src/db.js`; seeding only runs when the `people` table is empty.

## Environment
- Start with `docker compose -f docker-compose.base44.yml up -d` (add `--build`
  after changing images).
- Dependencies are installed by each service's startup command into named volumes
  (`api_node_modules`, `web_node_modules`); the repo checkout has no `node_modules`.
- SQLite data is in the `kudos_data` volume. Deleting the volume re-seeds.

## Sandbox-only behaviour
- `web/src/vite.config.ts` reads `BASE44_PREVIEW_MODE`; only when it is exactly
  `"1"` does it allow the rotating `.<BASE44_SANDBOX_HOST_DOMAIN>` host wildcard and
  enable polling file watch. Unset/other values keep Vite's defaults.

## Verifying
- `curl -s localhost:3000/ | head` should return the Vite HTML shell.
- `curl -s localhost:3000/api/health` should return `{"ok":true}` (proxied).
- No test suite yet; drive the UI through the preview tools.
