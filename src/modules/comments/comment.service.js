import { AppError } from "../../shared/exceptions/AppError.js";
import { commentRepository } from "./comment.repository.js";
import { postRepository } from "../posts/post.repository.js";

export const commentService = {
  createComment: async ({ authorId, parentId, postId, content }) => {
    const post = await postRepository.findById(postId);
    if (!post) {
      throw new AppError("Bài viết không tồn tại", 400, "BAD_REQUEST");
    }

    if (parentId) {
      const parent = await commentRepository.findById(parentId);

      if (!parent) {
        throw new AppError("parent không tồn tại", 400, "BAD_REQUEST");
      }
    }

    const comment = await commentRepository.createComment({
      authorId,
      postId,
      parentId,
      content,
    });

    return comment;
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
