import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const { createAdapter } = require("@socket.io/cluster-adapter");
const { setupWorker } = require("@socket.io/sticky");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io", "http://api.dev.busition.com"],
    credentials: true,
  },
});
io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});
// dummy data
const dummmy_data = { location: [36.611, 126.979], delayed: 330 };

// namespace 정의, 우리 서비스 별로
const busitionConsole = io.of("/console");
const busitionUser = io.of("/user");
const busitionMate = io.of("/mate");

app.get("/", (req, res) => {
  const rooms = Array.from(busitionUser.adapter.rooms);
  res.send(rooms);
});

// /console로 열린 소켓
busitionConsole.on("connection", (socket) => {
  let state = false;
  console.log("here is console namespace");
  socket.onAny((eventName, ...args) => {
    console.log("%s: ", eventName, args);
  });
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

// /user 열린 소켓
busitionUser.on("connection", (socket) => {
  console.log("here is driver namespace");
  let state = false;
  console.log("here is console namespace");
  socket.onAny((eventName, ...args) => {
    console.log("%s: ", eventName, args);
  });

  // room_id를 통해서 방에 들어가기 방이 없으면 못드감
  socket.on("join_room", (room_id) => {
    const room = busitionUser.adapter.rooms.get(room_id);

    if (room) {
      console.log("busition Driver ${room_id} exists.");
      socket.join(room_id);
      console.log(`Socket ${socket.id} joined room '${room_id}'`);
      state = true;

      const send_data = setInterval(() => {
        busitionUser.to(room_id).emit("data", dummmy_data);
        if (!state) {
          clearInterval(send_data);
        }
      }, 1000);
    } else {
      console.log(`busition Driver ${room_id} does not exist.`);
    }
  });

  socket.on("open_room", (msg) => {
    const route_id = msg;
    state = true;
    console.log(route_id);
    socket.join(route_id);
    console.log(`Socket ${socket.id} created room '${route_id}'`);

    /*
    id를 통해서 알맞는 데이터를 선정
    */
    const send_data = setInterval(() => {
      busitionUser.to(route_id).emit("data", dummmy_data);
      if (!state) {
        clearInterval(send_data);
      }
    }, 1000);
  });
  socket.on(
    "send_location",
    (location: { latitude: number; longitude: number }) => {
      console.log(location);
      dummmy_data.location = [location.latitude, location.longitude];
    }
  );
  socket.on("send_user", (uuid: { uuid: string }) => {
    console.log(uuid);
  });
  socket.on("disconnecting", () => {
    state = false;
  });
});

// /mate로 열린 소켓
busitionMate.on("connection", (socket) => {
  console.log("here is mate namespace");
});
const PORT = process.env.PORT || 3000;

instrument(io, {
  // auth: {
  //   type: "basic",
  //   username: "admin",
  //   password: "$2a$10$qWN96KxB944iiK1mnAl4WeLOdewMKuv3lFUnScsnoPxIEAPgcA3KK",
  // },
  auth: false,
});
io.adapter(createAdapter());

setupWorker(io);
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
