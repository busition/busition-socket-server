import jwt from "jsonwebtoken";
import dotenv from "dotenv";

function verifyToken(token, type) {
  dotenv.config({ path: "/socket_sever_data/.env" });

  return jwt.verify(token, process.env.COMBINESECRET);
}

export { verifyToken };
