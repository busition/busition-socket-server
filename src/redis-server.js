//redis
import { createClient } from "redis";
import dotenv from "dotenv";

async function getRedisClient() {
  dotenv.config({ path: "/socket_sever_data/.env" });

  const client = createClient({
    url: process.env.REDIS || "redis://localhost:6379",
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  return client;
}

async function redisHash(passenger_list) {
  passenger_list.forEach(async (passenger) => {
    const { uuid, id } = passenger;
    await client.HSET(id, uuid, "false");
  });
}

export { getRedisClient };
