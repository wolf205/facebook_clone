import { AppError } from "../../shared/exceptions/AppError.js";
import { friendRepository } from "./friend.repository.js";
import { userRepository } from "../users/user.repository.js";
import sequelize from "../../shared/config/database.js";

const escapeLike = (str) => str.replace(/[%_\\]/g, "\\$&");

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

  acceptFriendRequest: async ({ userId, requestId }) => {
    const friendRequest =
      await friendRepository.getFriendRequestById(requestId);

    if (!friendRequest || friendRequest.status !== "pending") {
      throw new AppError(
        "Yêu cầu kết bạn không tồn tại hoặc đã được xử lý",
        400,
        "NOT_FOUND_FRIEND_REQUEST",
      );
    }

    if (friendRequest.receiverId !== userId) {
      throw new AppError(
        "Bạn không có quyền chấp nhận yêu cầu kết bạn",
        403,
        "UN_AUTHORIZATION",
      );
    }

    const friendId = friendRequest.senderId;

    const t = await sequelize.transaction();

    try {
      await friendRepository.acceptFriendRequest(
        { requestId },
        { transaction: t },
      );

      await friendRepository.createFriendship(
        { userId, friendId },
        { transaction: t },
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw new AppError(
        `Lỗi không thể ghi dữ liệu: ${error.message}`,
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    return;
  },

  rejectFriendRequest: async ({ userId, requestId }) => {
    const friendRequest =
      await friendRepository.getFriendRequestById(requestId);

    if (!friendRequest || friendRequest.status !== "pending") {
      throw new AppError(
        "Yêu cầu kết bạn không tồn tại hoặc đã được xử lý",
        400,
        "NOT_FOUND_FRIEND_REQUEST",
      );
    }

    if (friendRequest.receiverId !== userId) {
      throw new AppError(
        "Bạn không có quyền từ chối yêu cầu kết bạn",
        403,
        "UN_AUTHORIZATION",
      );
    }

    await friendRepository.rejectFriendRequest(requestId);

    return;
  },

  getFriendList: async ({ userId, page, limit, search }) => {
    const normalizedSearch = search ? escapeLike(search.trim()) : null;
    const result = await friendRepository.getFriendList({
      userId,
      page,
      limit,
      search: normalizedSearch,
    });

    return {
      result,
    };
  },

  unfriend: async ({ userId, friendId }) => {
    const existingFriendship = await friendRepository.isExistsFriendship({
      userId,
      friendId,
    });

    if (!existingFriendship) {
      throw new AppError("Hai người không phải là bạn bè", 400, "BAD_REQUEST");
    }

    const t = await sequelize.transaction();

    try {
      await friendRepository.deleteFriendship(
        { userId, friendId },
        { transaction: t },
      );

      await friendRepository.deleteFriendRequest(
        { userId, friendId },
        { transaction: t },
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw new AppError(`Lỗi khi unfriend: ${error.message}`, 500);
    }

    return;
  },
};
