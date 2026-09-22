import { MongoClient } from "mongodb";
import { env } from "./env.js";

let client;
let db;

export async function connectDatabase() {
  client = new MongoClient(env.mongoUri);
  await client.connect();

  db = client.db(env.mongoDb);

  console.log("MongoDB connected");
}

export function getDatabase() {
  if (!db) {
    throw new Error("Database has not been initialized");
  }

  return db;
}
