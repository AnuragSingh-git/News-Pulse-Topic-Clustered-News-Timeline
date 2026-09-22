# News Pulse Node API

Scalable Express API required by the assessment.

## Structure

`routes/` = endpoint definitions  
`controllers/` = request/response handling  
`services/` = business/API logic  
`config/` = environment and database setup  
`middleware/` = shared Express middleware

## Endpoints

- `GET /api/clusters`
- `GET /api/clusters/:id`
- `GET /api/timeline`
- `POST /api/ingest/trigger`
- `GET /api/ingest/status/:jobId`

## Run

```bash
npm install
# copy .env.example to .env
npm run dev
```

Node runs on port 5000 and calls the Python service on port 8000.
