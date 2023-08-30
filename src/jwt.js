import jwt from "jsonwebtoken";
import dotenv from "dotenv";

function verifyToken(token, type) {
  dotenv.config({ path: "/socket_sever_data/.env" });
  if (type == "combine") {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.COMBINESECRET, (err, decoded) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.DRIVERSECRET, (err, decoded) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
  }
}

export { verifyToken };
