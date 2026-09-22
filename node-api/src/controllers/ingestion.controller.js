import {
  startIngestion,
  getIngestionJobStatus,
} from "../services/ingestion.service.js";

export async function triggerIngestion(req, res, next) {
  try {
    const result = await startIngestion();
    res.status(202).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getIngestionStatus(req, res, next) {
  try {
    const result = await getIngestionJobStatus(req.params.jobId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
