# News Pulse Frontend

A polished Next.js frontend for the existing News Pulse Node API.

## Run

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to the Node API base URL (for example `http://localhost:5000/api`).

## UX
- Visual topic timeline with cluster sizing/intensity
- Search and source filtering
- Cluster detail drawer with chronological article coverage
- Original article links
- Refresh action that triggers ingestion and polls the job
- Loading, empty and error states
- Responsive layout for desktop and mobile
