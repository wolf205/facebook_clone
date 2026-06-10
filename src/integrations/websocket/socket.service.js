import { Server } from "socket.io";
import { verifyAccessToken } from "../../shared/config/jwt.js";
import { logger } from "../../shared/utils/logger.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    try {
      const authHeader =
        socket.handshake.auth?.token ||
        socket.handshake.query?.token ||
        socket.handshake.headers["Authorization"];
      const decoded = verifyAccessToken(authHeader);
      socket.user = {
        id: decoded.id,
        role: decoded.role,
      };
      next();
    } catch (error) {
      next(new Error(error.errorCode || "UNAUTHORIZED"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    logger.info("Socket connected", { userId, socketId: socket.id });

    socket.join(userId);

    socket.on("disconnect", () => {
      logger.info("Socket disconnected", { userId, socketId: socket.id });
    });
  });

  logger.info("Socket.io initialized");
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io chưa được khởi tạo");
  return io;
};
