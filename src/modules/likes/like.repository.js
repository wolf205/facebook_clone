import Like from "./like.model.js";

export const likeRepository = {
  isExistsLike: async ({ userId, targetId, targetType }, options = {}) => {
    const like = await Like.findOne({
      where: {
        userId,
        targetId,
        targetType,
      },
      ...options,
    });

    return !!like;
  },

  createLike: async ({ userId, targetId, targetType }, options = {}) => {
    return await Like.create(
      {
        userId,
        targetId,
        targetType,
      },
      options,
    );
  },

  deleteLike: async ({ userId, targetId, targetType }, options = {}) => {
    return await Like.destroy({
      where: {
        userId,
        targetId,
        targetType,
      },
      options,
    });
  },
};
