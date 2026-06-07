import { postRepository } from "./post.repository.js";
import { AppError } from "../../shared/exceptions/AppError.js";
import { getMediaTypeFromUrl } from "../../shared/utils/file.js";
import sequelize from "../../shared/config/database.js";
import { cloudinaryService } from "../../integrations/cloudinary/cloudinary.service.js";

export const postService = {
  createPost: async ({ id, content, privacy, media }) => {
    const t = await sequelize.transaction();

    try {
      const formattedMedia = media.map((item, index) => ({
        mediaUrl: item.url,
        publicId: item.publicId,
        mediaType: getMediaTypeFromUrl(item.url),
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

  updatePost: async ({ userId, postId, updateData }) => {
    const post = await postRepository.getPostById(postId);

    if (!post) {
      throw new AppError("Bài viết không tồn tại", 400, "NOT_FOUND_POST");
    }

    if (post.authorId !== userId) {
      throw new AppError(
        "Bạn không có quyền sửa bài viết này",
        403,
        "POST_FORBIDDEN",
      );
    }

    const t = await sequelize.transaction();

    try {
      const { media, content, privacy } = updateData;

      await postRepository.updatePost(
        { postId, content, privacy },
        { transaction: t },
      );

      if (media !== undefined) {
        await postRepository.deleteMediaByPostId(
          { postId },
          { transaction: t },
        );

        if (media.length > 0) {
          const formattedMedia = media.map((item, index) => ({
            mediaUrl: item.url,
            publicId: item.publicId,
            mediaType: getMediaTypeFromUrl(item.url),
            orderIndex: index,
          }));

          await postRepository.insertMedia(
            { formattedMedia },
            { transaction: t },
          );
        }
      }

      await t.commit();

      if (media !== undefined && post.media?.length > 0) {
        await Promise.all(
          post.media.map((m) => cloudinaryService.deleteFile(m.publicId)),
        );
      }

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

    if (post.media?.length > 0) {
      await Promise.all(
        post.media.map((m) => cloudinaryService.deleteFile(m.publicId)),
      );
    }

    await postRepository.deletePostById(postId);

    return;
  },
};
