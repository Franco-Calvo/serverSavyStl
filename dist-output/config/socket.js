import { Server } from "socket.io";
let io = null;
const users = {};
export function emitEventToUser(userId, eventName, data) {
    const clients = users[userId];
    if (clients)
        clients.map((clientSocket) => {
            clientSocket.emit(eventName, data);
        });
}
export function setupSockets(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("Nuevo cliente conectado:", socket.id);
        socket.on("set-client", (roomId) => {
            // socket.join(roomId);
            // socket.to(roomId).emit("userJoined", socket.id);
            if (!users[roomId])
                users[roomId] = [];
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
