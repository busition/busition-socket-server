import pg from "pg";
import dotenv from "dotenv";
import logger from "./winston.js";

async function getPostgresqlClient() {
  const connectionConfig = {
    user: process.env.PSQLNAME,
    password: process.env.PSQLPASSWORD,
    database: process.env.PSQLDATABASE,
    host: process.env.PSQLHOST,
    port: process.env.PSQLPORT,
  };
  const client = new pg.Client(connectionConfig);
  await client.connect();
  return client;
}

export { getPostgresqlClient };
