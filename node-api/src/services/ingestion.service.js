import axios from "axios";
import { env } from "../config/env.js";

export async function startIngestion() {
  const response = await axios.post(
    `${env.pythonServiceUrl}/ingest`
  );

  return response.data;
}

export async function getIngestionJobStatus(jobId) {
  const response = await axios.get(
    `${env.pythonServiceUrl}/ingest/status/${jobId}`
  );

  return response.data;
}
