import { likeRepository } from "./like.repository.js";
import { AppError } from "../../shared/exceptions/AppError.js";
import { getIO } from "../../integrations/websocket/socket.service.js";
import sequelize from "../../shared/config/database.js";
import { notificationService } from "../notifications/notification.service.js";

export const likeService = {
  toggleLike: async ({ userId, targetId, targetType, targetRepository }) => {
    const target = await targetRepository.findById(targetId);

    if (!target) {
      throw new AppError("Đối tượng không tồn tại", 400, "BAD_REQUEST");
    }

    const t = await sequelize.transaction();

    try {
      const existingLike = await likeRepository.isExistsLike(
        { userId, targetId, targetType },
        { transaction: t },
      );

      let isLiked = false;

      if (existingLike) {
        await likeRepository.deleteLike(
          { userId, targetId, targetType },
          { transaction: t },
        );
        await targetRepository.decrementLike(targetId, { transaction: t });
      } else {
        await likeRepository.createLike(
          { userId, targetId, targetType },
          { transaction: t },
        );
        await targetRepository.incrementLike(targetId, { transaction: t });
        isLiked = true;

        const notification = {
          senderId: userId,
          receiverId: target.authorId,
          type: targetType === "post" ? "like_post" : "like_comment",
          content:
            targetType === "post"
              ? "Đã like bài viết của bạn"
              : "Đã like comment của bạn",
          referenceId: targetId,
          referenceType: targetType === "post" ? "post" : "comment",
          targetRepository: targetRepository,
        };

        await notificationService.createNotification(notification, {
          transaction: t,
        });
      }

      await t.commit();

      const updatedTarget = await targetRepository.findById(targetId);

      const io = getIO();

      const payload = {
        targetId,
        targetType,
        likeCount: updatedTarget.likeCount,
        action: isLiked ? "liked" : "unliked",
      };

      if (targetType === "message") {
        const participants = await targetRepository.getParticipantIds(
          target.conversationId,
        );
        participants.forEach((p) => {
          io.to(p).emit("like_message", payload);
        });
      } else if (targetType === "post") {
        io.to(userId).emit("like_post", payload);
      }

      return {
        liked: isLiked,
        likeCount: updatedTarget.likeCount,
      };
    } catch (error) {
      await t.rollback();
      throw new AppError(`Lỗi xử lý like: ${error.message}`, 500);
    }
  },
};
