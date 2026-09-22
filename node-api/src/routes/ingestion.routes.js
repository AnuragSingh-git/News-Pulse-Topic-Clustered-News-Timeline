import { Router } from "express";
import {
  triggerIngestion,
  getIngestionStatus,
} from "../controllers/ingestion.controller.js";

const router = Router();

router.post("/ingest/trigger", triggerIngestion);
router.get("/ingest/status/:jobId", getIngestionStatus);

export default router;
