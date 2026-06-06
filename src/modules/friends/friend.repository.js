import FriendRequest from "./friendRequest.model.js";
import Friendship from "./friendship.model.js";

export const friendRepository = {
  createFriendRequest: async ({ senderId, receiverId }) => {
    return await FriendRequest.create({ senderId, receiverId });
  },

  isExistsRequest: async ({ senderId, receiverId }) => {
    return await FriendRequest.findOne({
      where: {
        [Op.or]: [
          { senderId: senderId, receiverId: receiverId }, 
          { senderId: receiverId, receiverId: senderId }, 
        ],
      },
      attributes: ["id"],
    });
  },

  getFriendRequestById: async (requestId) => {
    return await FriendRequest.findByPk(requestId);
  },

  acceptFriendRequest: async ({ requestId }, options = {}) => {
    return await FriendRequest.update(
      { status: "accepted" },
      {
        where: { id: requestId },
        ...options,
      },
    );
  },

  rejectFriendRequest: async (requestId) => {
    return await FriendRequest.update(
      { status: "rejected" },
      { where: { id: requestId } },
    );
  },

  createFriendship: async ({ userId, friendId }, options = {}) => {
    return await Friendship.bulkCreate(
      [
        { userId: userId, friendId: friendId },
        { userId: friendId, friendId: userId },
      ],
      options,
    );
  },
};
