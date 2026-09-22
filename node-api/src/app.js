import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";
import clusterRoutes from "./routes/cluster.routes.js";
import timelineRoutes from "./routes/timeline.routes.js";
import ingestionRoutes from "./routes/ingestion.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", clusterRoutes);
app.use("/api", timelineRoutes);
app.use("/api", ingestionRoutes);

app.use(errorHandler);

export default app;
