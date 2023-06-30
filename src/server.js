import dotenv from "dotenv";

dotenv.config({ path: "/env/.env" });
import { getRedisClient } from "./redis-server.js";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { createAdapter } from "@socket.io/cluster-adapter";
import { setupWorker } from "@socket.io/sticky";

import admin from "firebase-admin";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(__dirname);
const serviceAccount = "/env/busition-firebase-adminsdk-p6mxk-de15bc77f9.json";

await admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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

//redis
const client = await getRedisClient();
//redis

// dummy data
const dummmy_data = {
  location: [36.611, 126.979],
  delayed: 330,
  speed: 0,
  stationName: "",
};

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
  // socket.onAny((eventName, ...args) => {
  //   console.log("%s: ", eventName, args);
  // });
  // socket.on("send_id", (msg) => {
  //   const { id } = msg;
  //   state = true;
  //   console.log(state);

  //   /*
  //   id를 통해서 알맞는 데이터를 선정
  //   */
  //   const send_data = setInterval(() => {
  //     socket.emit("data", dummmy_data);
  //     if (!state) {
  //       clearInterval(send_data);
  //     }
  //   }, 1000);
  // });
  socket.on("disconnecting", () => {
    state = false;
  });

  socket.on("test", (uuid) => {
    console.log(uuid);
    console.log("test");
    console.log(dynamoDB);
    const params = {
      TableName: "schedules_v2",
    };

    dynamoDB.scan(params, async (err, data) => {
      if (err) {
        console.log("err");
        console.log(err);
      } else {
        console.log(data);
      }
    });
  });
});

// /user 열린 소켓
busitionUser.on("connection", (socket) => {
  console.log("here is user namespace");
  let state = false;
  // console.log("here is console namespace");
  // socket.onAny((eventName, ...args) => {
  //   console.log("%s: ", eventName, args);
  // });

  // room_id를 통해서 방에 들어가기 방이 없으면 못드감
  socket.on("join_room", (room_id) => {
    const room = busitionUser.adapter.rooms.get(room_id);
    console.log("join_room", room);
    if (room) {
      console.log("busition Driver ${room_id} exists.");
      socket.join(room_id);
      console.log(`Socket ${socket.id} joined room '${room_id}'`);
      state = true;
      busitionUser.to(socket.id).emit("code", 200);
      // const send_data = setInterval(() => {
      //   busitionUser.to(room_id).emit("data", dummmy_data);
      //   if (!state) {
      //     clearInterval(send_data);
      //   }
      // }, 1000);
    } else {
      busitionUser.to(socket.id).emit("code", 404);
      console.log(`busition room ${room_id} not open`);
    }
  });

  socket.on("exit", async (msg) => {
    console.log("exit", msg);
    const route = msg.route_id + "?" + msg.type;
    const room = busitionUser.adapter.rooms.get(route);

    if (room) {
      console.log("exit", room);
      busitionUser.to(room).emit("code", 404);
      busitionUser.adapter.rooms.delete(route);
    } else {
      console.log(`busition Driver ${room_id} does not exist.`);
    }
  });

  socket.on("open_room", async (msg) => {
    // const { route_id, type } = msg;
    const room_info = await JSON.parse(msg);
    const route = room_info.route_id + "?" + room_info.type;
    state = true;
    console.log(route);
    socket.join(route);
    console.log(`Socket ${socket.id} created room '${route}'`);

    /*
    id를 통해서 알맞는 데이터를 선정
    */
    const send_data = setInterval(() => {
      busitionUser.to(route).emit("data", dummmy_data);
      if (!state) {
        clearInterval(send_data);
      }
    }, 1000);
  });

  socket.on("company user", (msg) => {
    const { uuid, id } = msg;
    console.log(uuid, id);
    socket.emit("user uuid", { uuid: uuid, "station uuid": id, name: "SaM" });
    //Todo
  });

  socket.on("check_passenger", async (msg) => {
    const passenger_list = await JSON.parse(msg);
    console.log(passenger_list);
    redisHash(passenger_list);
  });

  socket.on("send_location", async (loc) => {
    console.log(loc);
    // const location_list = await JSON.parse(loc);
    dummmy_data.location = [loc.latitude, loc.longitude];
    dummmy_data.speed = loc.speed;
    dummmy_data.stationName = loc.stationName;
  });
  socket.on("send_user", (uuid) => {
    console.log(uuid);
  });
  socket.on("check", async (uuid) => {
    console.log(uuid);
    const tmp = await client.hGet("test", uuid);
    console.log(tmp);
  });
  socket.on("del", async (uuid) => {
    console.log(uuid);
    const tmp = await client.del("test");
    console.log(tmp);
  });
  socket.on("disconnecting", () => {
    state = false;
    busitionUser.socketsLeave(socket.id);
  });

  //test code
  socket.on("test", (msg) => {
    console.log("test");
    const registrationToken = msg;

    const message = {
      notification: {
        title: "Portugal vs. Denmark",
        body: "5 to 1",
      },

      token: registrationToken,
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  });
  // This registration token comes from the client FCM SDKs.

  //test code
});

// /mate로 열린 소켓
busitionMate.on("connection", (socket) => {
  console.log("here is mate namespace");
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
});

//function

async function redisHash(passenger_list) {
  passenger_list.forEach(async (passenger) => {
    const { uuid, id } = passenger;
    await client.HSET(id, uuid, "false");
  });
}

function distance(lat1, lon1, lat2, lon2) {
  var R = 6371; // 지구 반지름(km)
  var dLat = Math.toRadians(lat2 - lat1);
  var dLon = Math.toRadians(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(Math.toRadians(lat1)) *
      Math.cos(Math.toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
