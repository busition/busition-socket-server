import logger from "./winston.js";

// dummy data
const dummmy_data = {
  location: [36.611, 126.979],
  delayed: 330,
  speed: 0,
  stationName: "",
};

const state = true;

async function BusitionDriver_open_room(socket, busitionUser, msg) {
  const room_info = await JSON.parse(msg);
  logger.http(socket.id, "login success : ", msg.user_id);
  const route = room_info.route_id + "?" + room_info.type;

  logger.info("BusitionDriver_open_room", route);
  socket.join(route);
  logger.info(`Socket ${socket.id} created room '${route}'`);

  const send_data = setInterval(() => {
    busitionUser.to(route).emit("data", dummmy_data);
    if (!state) {
      clearInterval(send_data);
    }
  }, 1000);
}

function BusitionDriver_exit(busitionUser, msg) {
  const route = msg.route_id + "?" + msg.type;
  const room = busitionUser.adapter.rooms.get(route);

  if (room) {
    logger.info(`Socket ${socket.id} exit room '${route}'`);
    busitionUser.to(room).emit("code", 404);
    busitionUser.adapter.rooms.delete(route);
  } else {
    logger.info(`busition Driver ${route} does not exist.`);
  }
}

function BusitionDriver_check_company_user(socket, msg) {
  const { uuid, id } = msg;
  console.log(uuid, id);
  socket.emit("user uuid", { uuid: uuid, "station uuid": id, name: "SaM" });
  //Todo
}

function BusitionDriver_update_location(loc) {
  console.log(loc);
  dummmy_data.location = [loc.latitude, loc.longitude];
  dummmy_data.speed = loc.speed;
  dummmy_data.stationName = loc.stationName;
}

function BusitionDriver_disconnecting(socket, busitionUser) {
  logger.info(`Socket ${socket.id} disconnecting`);
  busitionUser.socketsLeave(socket.id);
}
export {
  BusitionDriver_open_room,
  BusitionDriver_exit,
  BusitionDriver_check_company_user,
  BusitionDriver_update_location,
  BusitionDriver_disconnecting,
};

// function distance(lat1, lon1, lat2, lon2) {
//   var R = 6371; // 지구 반지름(km)
//   var dLat = Math.toRadians(lat2 - lat1);
//   var dLon = Math.toRadians(lon2 - lon1);
//   var a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(Math.toRadians(lat1)) *
//       Math.cos(Math.toRadians(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }
