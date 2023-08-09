import logger from "./winston.js";

function BusitionMate_join_room(
  busitionUser,
  socket,
  user_id,
  room_id,
  busitionMate
) {
  logger.http(`${socket.id} login success :  ${user_id}`);
  const room = busitionUser.adapter.rooms.get(room_id);
  logger.info(`Socket ${socket.id} try to join room '${room_id}'`);
  if (room) {
    socket.join(room_id);
    logger.info(`Socket ${socket.id} joined room '${room_id}'`);
    busitionMate.to(socket.id).emit("code", 200);
  } else {
    busitionMate.to(socket.id).emit("code", 404);
    logger.info(`busition room ${room_id} not open`);
  }
}

export { BusitionMate_join_room };
