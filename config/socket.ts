import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import TicketService from "../services/TicketService.js";

let io: Server | null = null;
const users: Record<string, Socket[]> = {};

export function emitEventToUser(userId: string, eventName: string, data: any) {
  const clients: Socket[] = users[userId];
  if (clients)
    clients.map((clientSocket) => {
      clientSocket.emit(eventName, data);
    });
}

export function setupSockets(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Nuevo cliente conectado:", socket.id);

    socket.on("set-client", (roomId) => {
      // socket.join(roomId);
      // socket.to(roomId).emit("userJoined", socket.id);
      if (!users[roomId]) users[roomId] = [];
      users[roomId].push(socket);
      console.log(roomId);
    });

    // socket.on("newMessage", async (messageData) => {
    //   const newMessage = await TicketService.addMessageToTicket(messageData);
    //   io?.to(messageData.roomId).emit("messageAdded", newMessage);
    //   console.log(newMessage);
    // });


    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });
}

export { io };
