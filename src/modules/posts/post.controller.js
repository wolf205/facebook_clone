import { response } from "../../shared/utils/reponse.js";
import { postService } from "./post.service.js";

export const postController = {
  createPost: async (req, res) => {
    const id = req.user.id;
    const { content, privacy, media } = req.body;

    const post = await postService.createPost({
      id,
      content,
      privacy,
      media,
    });

    return response(res, {
      message: "Tạo bài viết thành công",
      statusCode: 201,
      data: post,
    });
  },

  updatePost: async (req, res) => {
    const postId = req.params.id;
    const userId = req.user?.id;
    const updateData = req.body;

    const result = await postService.updatePost({ userId, postId, updateData });

    return response(res, {
      message: "Updated bài viết thành công",
      statusCode: 200,
      data: result,
    });
  },

  getPost: async (req, res) => {
    const postId = req.params.id;

    const result = await postService.getPost(postId);

    return response(res, {
      message: "Lấy bài viết thành công",
      statusCode: 200,
      data: result,
    });
  },

  deletePost: async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    await postService.deletePost({ userId, postId });

    return response(res, {
      message: "Xoá bài viết thành công",
      statusCode: 200,
    });
  },
};
