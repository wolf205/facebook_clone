import { response } from "../../shared/utils/reponse.js";
import { commentService } from "./comment.service.js";

export const commentController = {
  createComment: async (req, res) => {
    const userId = req.user?.id;
    const postId = req.params?.id;
    const { content, parentId } = req.body;

    const result = await commentService.createComment({
      authorId: userId,
      postId,
      parentId,
      content,
    });

    return response(res, {
      message: "Bình luận thành công",
      statusCode: 201,
      data: result,
    });
  },

  getComments: async (req, res) => {
    const postId = req.params?.id;
    const { page, limit } = req.query;

    const result = await commentService.getComments({ postId, page, limit });

    return response(res, {
      message: "Lấy comments thành công",
      statusCode: 200,
      data: result,
    });
  },

  getReplies: async (req, res) => {
    const parentId = req.params?.id; 
    const { page, limit } = req.query;

    const result = await commentService.getReplies({ parentId, page, limit });

    return response(res, {
      message: "Lấy replies thành công",
      statusCode: 200,
      data: result,
    });
  },
};
