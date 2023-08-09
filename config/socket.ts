import * as socketIo from "socket.io";
import http from "http";

export const initializeSocket = (server: http.Server) => {
  const io = new socketIo.Server(server);

  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    socket.on("joinRoom", (room) => {
      socket.join(room);
    });

    socket.on("sendMessage", async (data) => {
      
      io.to(data.room).emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });
};
