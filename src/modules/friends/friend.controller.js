import { response } from "../../shared/utils/reponse.js";
import { friendService } from "./friend.service.js";

export const friendController = {
  sendFriendRequest: async (req, res) => {
    const senderId = req.user?.id;
    const receiverId = req.params?.id;

    await friendService.sendFriendRequest({ senderId, receiverId });

    return response(res, {
      message: "Gửi lời mời kết bạn thành công",
      statusCode: 201,
    });
  },

  acceptFriendRequest: async (req, res) => {
    const userId = req.user?.id;
    const requestId = req.params?.id;

    await friendService.acceptFriendRequest({ userId, requestId });

    return response(res, {
      message: "Chấp nhận lời mời kết bạn thành cồng",
      statusCode: 200,
    });
  },

  rejectFriendRequest: async (req, res) => {
    const userId = req.user?.id;
    const requestId = req.params?.id;

    await friendService.rejectFriendRequest({ userId, requestId });

    return response(res, {
      message: "Từ chối lời mời kết bạn thành công",
      statusCode: 200,
    });
  },
};
