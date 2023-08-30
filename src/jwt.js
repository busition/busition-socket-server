import jwt from "jsonwebtoken";
import dotenv from "dotenv";

function verifyToken(token, type) {
  dotenv.config({ path: "/socket_sever_data/.env" });
  console.log("Token:", token);

  try {
    const decodedToken = jwt.verify(token, process.env.COMBINESECRET, {
      algorithms: [process.env.SECRETALGORITHM],
    });
    console.log("Decoded Token:", decodedToken);
  } catch (error) {
    console.log("Error decoding token:", error.message);
  }
}

export { verifyToken };
