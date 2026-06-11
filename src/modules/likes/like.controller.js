import { likeService } from "./like.service.js";
import { response } from "../../shared/utils/reponse.js";
import { postRepository } from "../posts/post.repository.js";
import { chatRepository } from "../chats/chat.repository.js";

export const likeController = {
  postLike: async (req, res) => {
    const userId = req.user?.id;
    const targetId = req.params?.id;

    const result = await likeService.toggleLike({
      userId,
      targetId,
      targetType: "post",
      targetRepository: postRepository,
    });

    return response(res, {
      message: "toggle like thành công",
      statusCode: 200,
      data: result,
    });
  },

  messageLike: async (req, res) => {
    const userId = req.user?.id;
    const targetId = req.params?.id;

    const result = await likeService.toggleLike({
      userId,
      targetId,
      targetType: "message",
      targetRepository: chatRepository,
    });

    return response(res, {
      message: "toggle like thành công",
      statusCode: 200,
      data: result,
    });
  },
};
