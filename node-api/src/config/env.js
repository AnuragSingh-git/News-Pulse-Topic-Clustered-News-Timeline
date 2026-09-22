import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI,
  mongoDb: process.env.MONGO_DB || "news_pulse",
  pythonServiceUrl:
    process.env.PYTHON_SERVICE_URL || "http://localhost:8000/api",
};
