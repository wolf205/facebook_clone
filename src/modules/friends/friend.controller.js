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
};
