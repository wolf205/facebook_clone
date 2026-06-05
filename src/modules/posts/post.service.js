import { postRepository } from "./post.repository.js";
import { AppError } from "../../shared/exceptions/AppError.js";
import { getMediaTypeFromUrl } from "../../shared/utils/file.js";
import sequelize from "../../shared/config/database.js";

export const postService = {
  createPost: async ({ id, content, privacy, media }) => {
    const t = await sequelize.transaction();

    try {
      const formattedMedia = media.map((url, index) => ({
        mediaUrl: url,
        mediaType: getMediaTypeFromUrl(url),
        orderIndex: index,
      }));

      const post = await postRepository.createPost(
        {
          id,
          content,
          privacy,
          formattedMedia,
        },
        { transaction: t },
      );

      await t.commit();
      return {
        post,
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  updatePost: async ({ postId, updateData }) => {
    const t = await sequelize.transaction();

    try {
      const { media, content, privacy } = updateData;

      const post = await postRepository.updatePost(
        { postId, content, privacy },
        { transaction: t },
      );

      if (media !== undefined) {
        await postRepository.deleteMediaByPostId(
          { postId },
          { transaction: t },
        );

        if (media.length > 0) {
          const formattedMedia = media.map((url, index) => ({
            postId,
            mediaUrl: url,
            mediaType: getMediaTypeFromUrl(url),
            orderIndex: index,
          }));

          await postRepository.insertMedia(
            { formattedMedia },
            { transaction: t },
          );
        }
      }

      await t.commit();
      return;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  getPost: async (postId) => {
    const post = await postRepository.getPostById(postId);

    if (!post) {
      throw new AppError("Bài post không tồn tại", 400, "NOT_FOUND_POST");
    }

    return {
      post,
    };
  },

  deletePost: async ({ userId, postId }) => {
    const post = await postRepository.getPostById(postId);

    if (!post) {
      throw new AppError("Bài viết không tồn tại", 400, "NOT_FOUND_POST");
    }

    if (post.authorId !== userId) {
      throw new AppError(
        "Bạn không có quyền xóa bài viết này",
        403,
        "POST_FORBIDDEN",
      );
    }

    await postRepository.deletePostById(postId);

    return;
  },
};
