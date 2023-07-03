function BusitionMate_join_room(socket, room_id) {
  const room = busitionUser.adapter.rooms.get(room_id);
  console.log("join_room", room);
  if (room) {
    console.log("busition Driver ${room_id} exists.");
    socket.join(room_id);
    console.log(`Socket ${socket.id} joined room '${room_id}'`);
    busitionUser.to(socket.id).emit("code", 200);
  } else {
    busitionUser.to(socket.id).emit("code", 404);
    console.log(`busition room ${room_id} not open`);
  }
}

export { BusitionMate_join_room };
