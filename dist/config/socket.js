var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as socketIo from "socket.io";
export const initializeSocket = (server) => {
    const io = new socketIo.Server(server);
    io.on("connection", (socket) => {
        console.log("Usuario conectado:", socket.id);
        socket.on("joinRoom", (room) => {
            socket.join(room);
        });
        socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            io.to(data.room).emit("message", data);
        }));
        socket.on("disconnect", () => {
            console.log("Usuario desconectado:", socket.id);
        });
    });
};
