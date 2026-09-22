import { Router } from "express";
import {
  getClusters,
  getClusterById,
} from "../controllers/cluster.controller.js";

const router = Router();

router.get("/clusters", getClusters);
router.get("/clusters/:id", getClusterById);

export default router;
