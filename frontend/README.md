# News Pulse — Frontend

Next.js (App Router) + Tailwind frontend for the News Pulse timeline. Talks to the
Node.js backend at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000/api`).

## Setup

```bash
npm install
cp .env.local.example .env.local   # adjust NEXT_PUBLIC_API_URL if needed
npm run dev
```

Open http://localhost:3000. The backend must be running for data to load.

## What's here

- `app/page.js` — top-level state: loads `/timeline`, tracks the active source
  filter, and owns which cluster is selected.
- `components/Timeline.js` — custom-built timeline (no charting library): clusters
  are laid out on a time axis and packed into lanes greedily so overlapping
  ranges don't collide. Block opacity scales with article count.
- `components/ClusterDetail.js` — slide-over panel that fetches
  `/clusters/:id` on selection and lists the articles.
- `components/SourceFilter.js` — toggle chips for filtering by source.
- `components/RefreshButton.js` — calls `POST /ingest/trigger`, then polls
  `GET /ingest/status/:jobId` every 2.5s until it reports a terminal status,
  then reloads the timeline.
- `lib/api.js` — fetch wrapper. Field names in the assessment spec aren't
  pinned down exactly (e.g. a cluster's time range could come back as
  `start`/`startTime`/`earliest`), so every response is normalized through
  `normalize*` helpers here rather than read directly in components.

## Assumptions made

- `GET /timeline` entries are assumed to include an `id` matching the cluster
  ID used by `GET /clusters/:id` (the spec doesn't explicitly list `id` among
  the timeline fields, only label/start/end/count). If the backend's timeline
  response omits it, clicking a block won't be able to load its detail —
  swap in whatever key the backend actually returns in `normalizeTimelineEntry`.
- Per-cluster source lists aren't in the required `/timeline` shape either.
  The filter row is built from whatever `sources` array (if any) is present
  on each entry; if the backend never sends one, every cluster is treated as
  matching every active source (the filter chips still render from
  `GET /clusters` isn't called for this — wire in a sources list from the
  backend if precise per-cluster filtering matters).
- Ingest status values are matched case-insensitively against
  `completed` / `done` / `success` / `failed` / `error`; adjust
  `TERMINAL_STATUSES` in `RefreshButton.js` if the backend uses different
  wording.

## Design notes

Editorial/wire-service palette (charcoal ground, warm paper ink, amber for the
live/refresh accent) with a serif for headlines and cluster labels so the
timeline reads like a newsroom board rather than a generic dashboard.
