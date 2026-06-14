import { notificationRepository } from "./notification.repository.js";
import { AppError } from "../../shared/exceptions/AppError.js";
import { getIO } from "../../integrations/websocket/socket.service.js";

export const notificationService = {
  createNotification: async (
    {
      senderId,
      receiverId,
      type,
      content,
      referenceId,
      referenceType,
      targetRepository,
    },
    options = {},
  ) => {
    if (referenceId && targetRepository) {
      const existingTarget = await targetRepository.findById(referenceId);
      if (!existingTarget) {
        throw new AppError(
          "Dữ liệu tham chiếu không tồn tại hoặc đã bị xóa",
          404,
          "BAD_REQUEST",
        );
      }

      const notification = await notificationRepository.createNotification(
        { userId: receiverId, senderId, type, content, referenceType, referenceId },
        options,
      );

      const io = getIO();
      io.to(receiverId).emit("new_notification", notification);

      return notification;
    }
  },
};
