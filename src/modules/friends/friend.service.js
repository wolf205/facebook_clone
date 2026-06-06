import { AppError } from "../../shared/exceptions/AppError.js";
import { friendRepository } from "./friend.repository.js";
import { userRepository } from "../users/user.repository.js";

export const friendService = {
  sendFriendRequest: async ({ senderId, receiverId }) => {
    if (senderId === receiverId) {
      throw new AppError(
        "Không thể gửi lời mời kết bạn cho chính mình",
        400,
        "CAN'T_SEND_FRIEND_REQUEST",
      );
    }

    const receiver = await userRepository.findUserById(receiverId);

    if (!receiver || !receiver.isActive) {
      throw new AppError(
        "Người nhận không tồn tại hoặc đã bị khóa tài khoản",
        400,
        "RECEIVER_NOT_FOUND",
      );
    }

    const existingRequest = await friendRepository.isExistsRequest({
      senderId,
      receiverId,
    });

    if (existingRequest) {
      throw new AppError("Bạn đã gửi lời mời kết bạn rồi", 409);
    }

    await friendRepository.createFriendRequest({ senderId, receiverId });

    return;
  },
};
