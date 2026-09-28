# Pulse – News Clustering Frontend

Next.js (App Router) + TypeScript + Tailwind CSS + Lucide icons.
Consumes the FastAPI `GET /clusters` endpoint.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

The backend URL is set in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## Backend requirement: CORS

Add this to your FastAPI `main.py`, then restart the server:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Expected `/clusters` response shape:

```json
{ "clusters": [ { "id": 0, "name": "Topic name",
  "articles": [ { "title": "...", "url": "...", "description": "..." } ] } ] }
```
