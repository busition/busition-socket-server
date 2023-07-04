import dotenv from "dotenv";

dotenv.config({ path: "/env/.env" });
import { getRedisClient } from "./redis-server.js";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { createAdapter } from "@socket.io/cluster-adapter";
import { setupWorker } from "@socket.io/sticky";
import { sendNotification } from "./firebase-fcm.js";
import { BusitionMate_join_room } from "./busition-mate.js";
import logger from "./winston.js";
import {
  BusitionDriver_open_room,
  BusitionDriver_exit,
  BusitionDriver_check_company_user,
  BusitionDriver_update_location,
  BusitionDriver_disconnecting,
} from "./busition-driver.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["*"],
    credentials: true,
  },
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

const PORT = process.env.PORT || 3000;

instrument(io, {
  auth: {
    type: "basic",
    username: "admin",
    password: "$2a$10$qWN96KxB944iiK1mnAl4WeLOdewMKuv3lFUnScsnoPxIEAPgcA3KK",
  },
});
io.adapter(createAdapter());

setupWorker(io);
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  logger.info(`Server listening on port ${PORT}`);
  // logger.error(`Server listening on port ${PORT}`);
});

//redis
const client = await getRedisClient();
//redis

// namespace 정의, 우리 서비스 별로
const busitionConsole = io.of("/console");
const busitionUser = io.of("/user");
const busitionMate = io.of("/mate");
const busitionTest = io.of("/test");

app.get("/", (req, res) => {
  const rooms = Array.from(busitionUser.adapter.rooms);
  res.send(rooms);
});

//test code
busitionTest.on("connection", (socket) => {
  console.log("here is test namespace");
  socket.on("test", (msg) => {
    sendNotification(socket, msg);
  });

  socket.on("test id", (msg) => {
    console.log(socket.id);
  });
});

// /console로 열린 소켓
busitionConsole.on("connection", (socket) => {
  logger.info(`Socket ${socket.id} connected to console namespace`);
});

// /user 열린 소켓
busitionUser.on("connection", (socket) => {
  logger.info(`Socket ${socket.id} connected to user namespace`);

  socket.on("exit", async (msg) => {
    BusitionDriver_exit(busitionUser, msg);
  });

  socket.on("open_room", async (msg) => {
    BusitionDriver_open_room(socket, busitionUser, msg);
  });

  socket.on("company user", (msg) => {
    BusitionDriver_check_company_user(socket, msg);
  });

  socket.on("send_location", async (msg) => {
    BusitionDriver_update_location(msg);
  });

  //redis sever test code
  // socket.on("check_passenger", async (msg) => {
  //   const passenger_list = await JSON.parse(msg);
  //   console.log(passenger_list);
  //   redisHash(passenger_list);
  // });
  // socket.on("check", async (uuid) => {
  //   console.log(uuid);
  //   const tmp = await client.hGet("test", uuid);
  //   console.log(tmp);
  // });
  // socket.on("del", async (uuid) => {
  //   console.log(uuid);
  //   const tmp = await client.del("test");
  //   console.log(tmp);
  // });

  socket.on("disconnecting", () => {
    BusitionDriver_disconnecting(socket, busitionUser);
  });

  //test code
});

// /mate로 열린 소켓
busitionMate.on("connection", (socket) => {
  logger.info(`Socket ${socket.id} connected to mate namespace`);

  socket.on("join_room", (msg) => {
    BusitionMate_join_room(socket, msg.user_id, msg.room_id);
  });
});
