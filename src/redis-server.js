//redis
import { createClient } from "redis";
import dotenv from "dotenv";

async function getRedisClient() {
  dotenv.config({ path: "./.env" });

  const client = createClient({
    url: process.env.REDIS || "redis://localhost:6379",
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  return client;
}

export { getRedisClient };
