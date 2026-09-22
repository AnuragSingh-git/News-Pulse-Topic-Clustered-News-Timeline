import { getDatabase } from "../config/database.js";

function collection() {
  return getDatabase().collection("clusters");
}

export async function findAllClusters() {
  return collection()
    .find({})
    .project({
      _id: 0,
      clusterId: 1,
      label: 1,
      articleCount: 1,
      startTime: 1,
      endTime: 1,
    })
    .sort({ startTime: 1 })
    .toArray();
}

export async function findClusterById(clusterId) {
  const cluster = await collection().findOne(
    { clusterId },
    { projection: { _id: 0 } }
  );

  if (cluster?.articles) {
    cluster.articles.sort((a, b) =>
      String(a.published || "").localeCompare(
        String(b.published || "")
      )
    );
  }

  return cluster;
}
