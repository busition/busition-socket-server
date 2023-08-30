import jwt from "jsonwebtoken";
import dotenv from "dotenv";

function verifyToken(token, type) {
  dotenv.config({ path: "/socket_sever_data/.env" });
  try {
    const decode = jwt.verify(token, process.env.COMBINESECRET);
    console.log(decode);
  } catch (err) {
    console.log(err);
  }
}

export { verifyToken };
