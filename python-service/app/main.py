from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.ingestion import router as ingestion_router
from app.core.config import settings

app = FastAPI(
    title="News Pulse Python Service",
    version="1.0.0",
)

app.include_router(health_router, prefix="/api")
app.include_router(ingestion_router, prefix="/api")


@app.get("/")
def root():
    return {"service": "news-pulse-python", "status": "ok"}
