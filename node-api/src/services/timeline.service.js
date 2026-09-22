import { getDatabase } from "../config/database.js";

export async function buildTimeline() {
  const clusters = await getDatabase()
    .collection("clusters")
    .find({})
    .project({
      _id: 0,
      clusterId: 1,
      label: 1,
      articleCount: 1,
      startTime: 1,
      endTime: 1,
      intensity: 1,
    })
    .sort({ startTime: 1 })
    .toArray();

  return clusters;
}
