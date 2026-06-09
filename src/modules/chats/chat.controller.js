import { response } from "../../shared/utils/reponse.js";
import { chatRepository } from "./chat.repository.js";
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

  getMessages: async (req, res) => {
    const userId = req.user?.id;
    const { page, limit } = req.query;
    const conversationId = req.params?.id;

    const result = await chatService.getMessages({
      userId,
      conversationId,
      page,
      limit,
    });

    return response(res, {
      message: "Lấy danh sách tin nhắn thành công",
      statusCode: 200,
      data: result,
    });
  },

  sendMessage: async (req, res) => {
    const userId = req.user?.id;
    const data = req.body;

    const result = await chatService.sendMessage({ userId, data });

    return response(res, {
      message: "Gửi tin nhắn thành công",
      statusCode: 201,
      data: result,
    });
  },
};
