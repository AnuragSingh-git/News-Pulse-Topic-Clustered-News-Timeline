import { Router } from "express";
import { getTimeline } from "../controllers/timeline.controller.js";

const router = Router();

router.get("/timeline", getTimeline);

export default router;
