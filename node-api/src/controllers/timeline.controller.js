import { buildTimeline } from "../services/timeline.service.js";

export async function getTimeline(req, res, next) {
  try {
    const timeline = await buildTimeline();
    res.json(timeline);
  } catch (error) {
    next(error);
  }
}
