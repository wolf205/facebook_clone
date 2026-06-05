import { response } from "../../shared/utils/reponse.js";
import { postService } from "./post.service.js";


export const postController = {
  createPost: async (req, res) => {
    const id = req.user.id;
    const { content, privacy, media } = req.body;

    

    const result = await postService.createPost({
      id,
      content,
      privacy,
      media,
    });

    return response(res, {
      message: "Tạo bài viết thành công",
      statusCode: 201,
      data: result,
    });
  },
};
