# Kudos Board

A public team wall for recognising colleagues: give kudos with a badge and a card
style, react to what others post, and see the spotlight of most-appreciated teammates.

- `web/` — React + Vite + Tailwind single-page app (port 3000)
- `api/` — Express + SQLite (better-sqlite3) API (port 8000, proxied by Vite at `/api`)

There is no login: the header's "Viewing as" switcher sets who you are (kept in
`localStorage`), which is what attributes kudos and reactions. Seeded with 12
teammates and a few kudos so the wall is never empty.

## Run it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

The web app is served on http://localhost:3000 and proxies `/api` to the API
container, so there is a single origin. Both services run the source from the
bind mount with live reload (`vite` HMR, `node --watch`).

The SQLite database lives in the `kudos_data` volume at `/data/kudos.db` and is
seeded on first start only. To start over, remove that volume.

## API

| Method | Path                       | Purpose                              |
| ------ | -------------------------- | ------------------------------------ |
| GET    | `/api/health`              | Liveness                             |
| GET    | `/api/people`              | Teammate directory                   |
| GET    | `/api/kudos`               | Wall; `badge`, `q`, `sort`, `viewer` |
| GET    | `/api/stats`               | Totals, spotlight, badge breakdown   |
| POST   | `/api/kudos`               | Create kudos                         |
| POST   | `/api/kudos/:id/reactions` | Toggle a reaction for the viewer     |
