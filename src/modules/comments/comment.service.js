import { AppError } from "../../shared/exceptions/AppError.js";
import { commentRepository } from "./comment.repository.js";
import { postRepository } from "../posts/post.repository.js";
import { notificationService } from "../notifications/notification.service.js";
import sequelize from "../../shared/config/database.js";

export const commentService = {
  createComment: async ({ authorId, parentId, postId, content }) => {
    const post = await postRepository.findById(postId);
    if (!post) {
      throw new AppError("Bài viết không tồn tại", 400, "BAD_REQUEST");
    }

    let parent = {};

    if (parentId) {
      parent = await commentRepository.findById(parentId);

      if (!parent) {
        throw new AppError("parent không tồn tại", 400, "BAD_REQUEST");
      }
    }

    const t = await sequelize.transaction();

    try {
      const comment = await commentRepository.createComment(
        {
          authorId,
          postId,
          parentId,
          content,
        },
        { transaction: t },
      );

      await postRepository.incrementComment({ postId }, { transaction: t });

      const receiverId = parentId ? parent.authorId : post.authorId;

      if (authorId !== post.authorId) {
        const notification = {
          senderId: authorId,
          receiverId: receiverId,
          type: parentId ? "reply_comment" : "comment_post",
          content: parentId
            ? "đã trả lời bình luận của bạn"
            : "đã bình luận về bài viết của bạn",
          referenceId: comment.id,
          referenceType: "comment",
          targetRepository: commentRepository,
        };

        await notificationService.createNotification(notification, {
          transaction: t,
        });
      }

      await t.commit();

      return comment;
    } catch (error) {
      await t.rollback();
      throw new AppError(`Lỗi khi tạo comment: ${error.message}`, 500);
    }
  },

  getComments: async ({ page, limit, postId }) => {
    const post = await postRepository.findById(postId);
    if (!post) {
      throw new AppError("Bài viết không tồn tại", 400, "BAD_REQUEST");
    }

    const comments = await commentRepository.getComments({
      postId,
      page,
      limit,
    });

    return comments;
  },

  getReplies: async ({ parentId, page, limit }) => {
    const parentComment = await commentRepository.findById(parentId);
    if (!parentComment) {
      throw new AppError("Comment gốc không tồn tại", 404, "NOT_FOUND");
    }

    const replies = await commentRepository.getReplies({
      parentId,
      page,
      limit,
    });

    return replies;
  },
};
