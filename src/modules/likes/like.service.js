import { likeRepository } from "./like.repository.js";
import { AppError } from "../../shared/exceptions/AppError.js";
import sequelize from "../../shared/config/database.js";

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
      }

      await t.commit();

      const updatedTarget = await targetRepository.findById(targetId);

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
