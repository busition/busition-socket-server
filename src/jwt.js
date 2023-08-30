import jwt from "jsonwebtoken";
import dotenv from "dotenv";

function verifyToken(token, type) {
  dotenv.config({ path: "/socket_sever_data/.env" });

  jwt.verify(token, process.env.COMBINESECRET, (err, decode) => {
    if (err) {
      console.log(err);
    } else {
      console.log(decode);
    }
  });
}

export { verifyToken };
