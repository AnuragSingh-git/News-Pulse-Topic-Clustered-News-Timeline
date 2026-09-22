import {
  findAllClusters,
  findClusterById,
} from "../services/cluster.service.js";

export async function getClusters(req, res, next) {
  try {
    const clusters = await findAllClusters();
    res.json(clusters);
  } catch (error) {
    next(error);
  }
}

export async function getClusterById(req, res, next) {
  try {
    const cluster = await findClusterById(req.params.id);

    if (!cluster) {
      return res.status(404).json({
        error: "Cluster not found",
      });
    }

    res.json(cluster);
  } catch (error) {
    next(error);
  }
}
