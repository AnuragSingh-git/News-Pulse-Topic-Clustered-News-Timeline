# News Pulse Python Service

Scalable Python/FastAPI service responsible for:

- RSS ingestion
- Article body extraction
- Duplicate removal
- Keyword-overlap clustering
- MongoDB persistence
- Ingestion job status

## Structure

`api/` = HTTP routes  
`services/` = business logic  
`repositories/` = database access  
`models/` = data structures  
`core/` = configuration and database connection

## Run

```bash
python -m venv venv
# Windows
venv\Scripts\activate

pip install -r requirements.txt
# copy .env.example to .env

python run.py
```

API base URL: `http://localhost:8000/api`
