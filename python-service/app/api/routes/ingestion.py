import uuid

from fastapi import APIRouter, BackgroundTasks

from app.services.ingestion_service import run_ingestion

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

jobs = {}


def run_job(job_id: str):
    jobs[job_id] = "running"

    try:
        run_ingestion()
        jobs[job_id] = "completed"
    except Exception as exc:
        print(f"Ingestion failed: {exc}")
        jobs[job_id] = "failed"


@router.post("")
def trigger_ingestion(background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = "queued"

    background_tasks.add_task(run_job, job_id)

    return {
        "jobId": job_id,
        "status": "queued",
    }


@router.get("/status/{job_id}")
def get_ingestion_status(job_id: str):
    status = jobs.get(job_id)

    if status is None:
        return {
            "jobId": job_id,
            "status": "not_found",
        }

    return {
        "jobId": job_id,
        "status": status,
    }
