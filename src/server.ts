import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// dummy data
const dummmy_data = { location: [36.611, 126.979], delayed: 330 };

// namespace 정의, 우리 서비스 별로
const busitionConsole = io.of("/console");
const busitionDirver = io.of("/driver");
const busitionMate = io.of("/mate");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// /console로 열린 소켓
busitionConsole.on("connection", (socket) => {
  let state = false;
  console.log("here is console namespace");
  socket.on("send_id", (msg) => {
    const { id } = msg;
    state = true;
    console.log(state);

    /*
    id를 통해서 알맞는 데이터를 선정
    */
    const send_data = setInterval(() => {
      socket.emit("data", dummmy_data);
      if (!state) {
        clearInterval(send_data);
      }
    }, 1000);
  });
  socket.on("disconnecting", () => {
    state = false;
  });
});

// /driver로 열린 소켓
busitionDirver.on("connection", (socket) => {
  console.log("here is driver namespace");
});

// /mate로 열린 소켓
busitionMate.on("connection", (socket) => {
  console.log("here is mate namespace");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
