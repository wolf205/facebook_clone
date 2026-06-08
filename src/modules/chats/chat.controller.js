import { response } from "../../shared/utils/reponse.js";
import { chatService } from "./chat.service.js";

export const chatController = {
  createConversation: async (req, res) => {
    const userId = req.user?.id;
    const data = req.body;

    const result = await chatService.createConversation({ userId, data });

    return response(res, {
      message: "Tạo cuộc hội thoại thành công",
      statusCode: 201,
      data: result,
    });
  },
};
